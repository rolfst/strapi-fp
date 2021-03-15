const { models: modelUtils } = require('strapi-utils')
const uploadFiles = require('strapi/lib/services/utils/upload-files')
const convertRestQueryParamsForAggregate = require('../../../config/functions/convertRestQueryParamsForAggregate')
const forwardResult = require('../../../lib/forwardResult')
const NotFoundError = require('../../../lib/NotFoundError')

const { getModelAttributes, toProjectionSettings } = require('../../../lib/projectKeyUtils')
const { getParticipants } = require('./rules/reactions')

const rtracer = require('cls-rtracer')

const R = require('ramda')
const either = require('crocks/pointfree/either')
const eitherToAsync = require('crocks/Async/eitherToAsync')
const getPathOr = require('crocks/helpers/getPathOr')
const pick = require('crocks/helpers/pick')
const omit = require('crocks/helpers/omit')

const { Async, Maybe, Result, State } = require('crocks')
const { Ok, Err } = Result
const { Just } = Maybe
const { get } = State
const { fromPromise } = Async

const defensiveObject = require('../../../lib/defensiveObject')
const {
  addAll,
  addArchived,
  addClosed,
  addCurrent,
  addFavorite,
  addFindOneChallenge,
  addMy,
  addProjection,
  addUpcoming,
  addUnpublished,
  addInterrests,
  buildRandomSorting,
  challengePipeline
} = require('./rules/challenges')
const { processStatus } = require('./rules')

const MODEL = 'plugins::challenges.challenge'
const SOURCE = 'challenges'

/**
 * add
 *
 * @param {Object} body content for Challenge
 * @param {Object} upload
 * @param {File| array<files>} upload.file or files to be saved
 * @param {string} upload.model model that files should refer to
 * @param {string} upload.source plugin where model refers to
 * @returns {Promise<Result<Challenge|Error>>} Challenge that is persisted
 */
async function add(body, { files = {}, model, source } = {}, user) {
  const log = strapi.log.child({ traceId: rtracer.id() })

  let entity = await strapi.query(model, source).create(body)

  if (files) {
    await uploadFiles(entity, files, { model, source })
  }

  return fetchOne({ slug: entity.slug }, user)
    .then(forwardResult)
    .catch((e) => {
      log.warn(`Error creating challenge: ${e}`)
      return Err(e)
    })
}

/**
 * update
 *
 * @param {Object} body content for Challenge
 * @param {Object} upload
 * @param {File| array<files>} upload.file or files to be saved
 * @param {string} upload.model model that files should refer to
 * @param {string} upload.source plugin where model refers to
 * @returns {Promise<Result<Challenge|Error>>} Challenge that is persisted
 */
async function update(params, body, { files } = {}, user) {
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`update challenge: ${params.slug}`)

  const { slug } = params

  let entity = strapi.query('challenge', 'challenges').update({ slug }, body)

  if (files) {
    entity = entity.then(async (entity) => {
      await uploadFiles(entity, files, { model: MODEL, source: SOURCE })
      return entity
    })
  }

  return entity
    .then(() => fetchOne({ slug }, user))
    .then(forwardResult)
    .catch((e) => {
      log.warn(`Error updating challenge: ${e}`)
      return Err(e)
    })
}

const types = {
  all: (keys, query, status, user) => {
    const sorting = buildRandomSorting(query)
    const filters = Just(convertRestQueryParamsForAggregate(omit(['sort', 'status', 'type'], query)))
    const pipelineArgs = sorting
      .concat(filters)
      .concat(
        Just(
          get()
            .chain(() => addInterrests(query, user))
            .chain(() => status(new Date().toISOString()))
            .chain(() => addProjection(keys))
            .execWith(challengePipeline(user))
        )
      )
      .option([])
    return pipelineArgs
  },
  favorites: (keys, query, status, user) => {
    const challengeIds = strapi.plugins['favorites'].services.favorites.fetchAll({ type: 'challenge', user })
    const filters = Just(convertRestQueryParamsForAggregate(omit(['sort', 'status', 'type'], query)))
    const pipelineArgs = filters
      .concat(
        Just(
          get()
            .chain(() => addFavorite(challengeIds))
            .chain(() => addProjection(keys))
            .execWith(challengePipeline(user))
        )
      )
      .option([])

    return pipelineArgs
  },
  my: (keys, query, status, user) => {
    const filters = Just(convertRestQueryParamsForAggregate(omit(['sort', 'status', 'type'], query)))
    const pipelineArgs = filters
      .concat(
        Just(
          get()
            .chain(() => addMy(user._id))
            .chain(() => status(new Date()))
            .chain(() => addProjection(keys))
            .execWith(challengePipeline(user))
        )
      )
      .option([])

    return pipelineArgs
  }
}
const typeStrategies = defensiveObject(types, types['all'])
const statuses = {
  current: (date) => addCurrent(date),
  unpublished: () => addUnpublished(),
  upcoming: (date) => addUpcoming(date),
  closed: (date) => addClosed(date),
  archived: () => addArchived(),
  all: () => addAll()
}
const statusStrategies = defensiveObject(statuses, statuses['current'])
/**
 * @description: fetches all challenges
 * @return {Promise<Result>} Result
 */
async function fetchAll(params, query = {}, user) {
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info('finding challenges')

  const model = strapi.query('challenge', 'challenges').model
  // sorting -> build random aggregate
  // logged in -> find based on interrest
  // get type: all, favorite, my
  // all: search in db no filter
  // favorite: lookup on user.favorites
  // my: lookup where I am moderator
  // get status: current, upcoming, closed, unplublished, archived, all
  // current: published after start before end
  // upcomming: published before start
  // closed: after end
  // unpublished: unpublished
  // archived: archived
  // all: this is for favorited challenges
  const status = statusStrategies[query.status]
  const attributes = await getModelAttributes('challenge').catch(() => {
    throw new Error('cannot get reaction attributes')
  })
  const keys = toProjectionSettings(attributes)
  const pipelineArgs = await typeStrategies[query.type](keys, query, status, user)
  const plainChallenges = model.aggregate(pipelineArgs).exec()

  return plainChallenges.then(forwardResult).catch((e) => {
    log.warn(`Error in fetching ${e}`)
    return Err(e)
  })
}

async function fetchArticles(params, query) {
  const { challenge_slug, slug } = params

  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`fetching articles related to challenge: ${challenge_slug}`)

  return strapi
    .query('challenge', 'challenges')
    .findOne({ slug: challenge_slug })
    .then((challenge_id) => {
      return strapi.plugins['articles'].services.articles.fetch({ challenge_id, slug }, query)
    })
    .then(forwardResult)
    .catch(Err)
}

async function fetchArticle(params, query) {
  const { challenge_slug, slug } = params

  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`fetching article ${slug}, related to challenge: ${challenge_slug}`)

  return strapi
    .query('challenge', 'challenges')
    .findOne({ slug: challenge_slug })
    .then((challenge_id) => {
      return strapi.plugins['articles'].services.articles.fetchOne({ challenge_id, slug }, query)
    })
    .then(forwardResult)
    .catch(Err)
}

async function fetchOne(params, user = {}) {
  const { slug } = params

  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`fetching challenge: ${slug}, user: ${user._id}`)

  const attributes = await getModelAttributes('challenge').catch(() => {
    throw new Error('cannot get challenge attributes')
  })
  const keys = toProjectionSettings(attributes)
  const pipelineArgs = Just(
    get()
      .chain(() => addFindOneChallenge(slug))
      .chain(() => addProjection(keys))
      .execWith(challengePipeline(user))
  ).option([])
  const model = strapi.query('challenge', 'challenges').model
  const plainChallenges = model.aggregate(pipelineArgs).exec()

  return plainChallenges
    .then((challenges) => {
      if (!challenges.length) throw new Error('No Challenge found')
      return challenges
    })
    .then(R.head)
    .then(forwardResult)
    .catch((e) => {
      log.warn(`Error in fetching ${e}`)
      return Err(e)
    })
}

async function fetchParticipants(params, user = {}) {
  return getParticipants(params, user)
    .then(forwardResult)
    .catch(Err)
}

async function fetchHighlights(params, query = {}, user = {}) {
  const log = strapi.log.child({ traceId: rtracer.id() })
  const { challenge_slug } = params

  log.info(`fetching highlighted reactions of challenge: ${challenge_slug}`)

  return strapi
    .query('challenge', 'challenges')
    .findOne({ slug: challenge_slug })
    .then((challenge) => {
      const { highlights } = challenge
      if (!highlights.length) return []
      const searchParams = highlights.map((highlight) => omit(['id'], highlight))

      const sortParam = { _sort: 'createdAt:ASC' }
      return strapi.plugins['challenges'].services.reactions.fetchAll(searchParams, Object.assign({}, sortParam, query), user)
    })
    .then(forwardResult)
    .catch(Err)
}

async function search(params, query) {
  const filters = modelUtils.convertParams('Challenge', params)
  const searchQ = Object.assign({}, params, query)

  const { challenge: Challenge } = strapi.plugins['challenges'].models

  return Challenge.find({ $text: { $search: searchQ._q }, ...filters.where }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip(filters.start)
    .limit(filters.limit)
    .populate(null)
    .then((results) => results.map((result) => (result ? result.toObject() : null)))
    .then(Ok)
    .catch(Err)
}

const _pin = (op) => async (user, params) => {
  const { slug } = params
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`${op} pin challenge: ${slug}`)

  const createFav = either(
    () => {
      throw new Error(`No challenge to ${op} provided`)
    },
    () =>
      strapi.plugins['favorites'].services[serviceName]
        .create(buildObject)
        .then(() => fetchOne({ slug }, user))
        .catch(Err)
  )
  const serviceName = `${op}s`
  const buildObject = { target: slug, owner_id: user, kind: 'challenge' }
  const existingObject = await strapi.plugins['favorites'].services[serviceName].findOne(slug, user)
  return either(
    async () => fetchOne({ slug }, user).then(createFav),
    async (o) =>
      strapi.plugins['favorites'].services[serviceName]
        .remove(o.id)
        .then(() => fetchOne({ slug }, user))
        .catch(Err),
    existingObject
  )
}

const _updateChallenge = (params) => (challenge) => {
  const command = fromPromise(update)
  const targetChallenge = pick(['_id', 'status'], challenge)
  targetChallenge.status = params.status
  const updated = command({ slug: params.slug }, targetChallenge, { source: SOURCE, model: MODEL })

  return updated
}

const _setStatus = async (user, params, body) => {
  const { slug } = params
  const { value } = body

  const attributes = await getModelAttributes('challenge').catch(() => {
    return Err('could not get challenge attributes')
  })

  if (!attributes.status.enum.includes(value)) return Err(`${value} is not a valid challenge status.`)

  const challenge = await strapi.query('challenge', 'challenges').findOne({ slug })
  if (!challenge) {
    throw new NotFoundError()
  }

  const exec = processStatus(params, user)
  return eitherToAsync(exec(challenge))
    .chain(_updateChallenge({ slug, status: value }))
    .toPromise()
    .then(forwardResult)
    .catch(Err)
}

const _patchOperations = {
  favorite: _pin('favorite'),
  like: _pin('like'),
  status: _setStatus
}
const notImplemented = (operation) => () => {
  return Err(`Operation not implemented: ${operation}`)
}

async function patch(params, body, user) {
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`${body.op}:`)

  const fn = getPathOr(notImplemented(body.op), [body.op], _patchOperations)

  return fn(user, params, body)
}

/**
 * Challenges.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */
module.exports = {
  add,
  fetchArticles,
  fetchArticle,
  fetchAll,
  fetchOne,
  fetchHighlights,
  fetchParticipants,
  patch,
  search,
  update
}
