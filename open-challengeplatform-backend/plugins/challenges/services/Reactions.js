const { getReactions, getOneReaction } = require('./rules/reactions')
const { models: modelUtils } = require('strapi-utils')
const { findChallengeBySlug } = require('../utils/challengeUtils')
const { isKvKModerator, isOwner, isModerator } = require('./rules')

const NotAllowedError = require('../../../lib/NotAllowedError')
const NotFoundError = require('../../../lib/NotFoundError')

const _ = require('lodash')
const rtracer = require('cls-rtracer')
const soundex = require('soundex-code')

const compose = require('crocks/helpers/compose')
const composeP = require('crocks/helpers/composeP')
const curry = require('crocks/helpers/curry')
const getPathOr = require('crocks/helpers/getPathOr')
const identity = require('crocks/combinators/identity')
const pick = require('crocks/helpers/pick')
const or = require('crocks/logic/or')
const setProp = require('crocks/helpers/setProp')

const omit = require('crocks/helpers/omit')
const ifElse = require('crocks/logic/ifElse')
const either = require('crocks/pointfree/either')

const { Result, Either } = require('crocks')
const { Ok, Err } = Result
const { Left, Right } = Either

const uploadFiles = require('../../../lib/uploadFiles')

const REMOVED_STATUS = 'removed'

// prevent strapi params to filling with '0'
const _omitZero = (params) => (Array.isArray(params) ? params : omit(['0'], params))
const _parentDepth = (parent) => setProp('depth', parent.depth || 0, parent)
const _parentDepthPlus1 = (parent) => setProp('depth', (parent.depth || 0) + 1, parent)
const _hasParent = (parent) => parent.parent_id
const _setDepth = ifElse(_hasParent, _parentDepthPlus1, _parentDepth)

const _buildReaction = (challenge_id, slugPart, parent, params, user) => {
  const full_slug = parent.full_slug ? `${parent.full_slug}~${slugPart}` : `${slugPart}`
  const updateParent = compose(
    _setDepth,
    setProp('parent_id', parent._id),
    pick(['depth', 'challenge_id'])
  )
  const doc = Object.assign({}, params, updateParent(parent), { status: 'active', challenge_id, full_slug, slug: slugPart, created_by: user })

  return doc
}

const _getUnixTime = (date) => (date.getTime() / 1000) | 0
const _generateSlugPart = (date, string) => `${_getUnixTime(date)}.${soundex(string, null)}`
const _findChallengeBySlug = async (slug) => {
  const challengeId = await findChallengeBySlug(slug)
  if (!challengeId) throw new NotFoundError('Reaction: challenge not found.')
  return challengeId.toString()
}

/**
 *  @name fetchAll
 *  @param {Object} params
 *  @param {Object} user
 *  @return {Promise<Array<Reaction>>}
 */
async function fetchAll(params, query = {}, user = {}) {
  const { challenge_slug } = params
  const cleanParams = _omitZero(params)

  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`fetching reactions: ${challenge_slug || 'no Challenge specified'}`)

  return getReactions({ params: cleanParams, query, user })
    .then(Ok)
    .catch((e) => {
      log.warn(`error in fetching: ${e}`)
      return Err(e)
    })
}

async function fetchOne(params, user = {}) {
  const { challenge_slug, slug } = params
  const cleanParams = _omitZero(params)

  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`fetching reaction: ${challenge_slug}::${slug}`)

  return getOneReaction({ params: cleanParams, user })
    .then(Ok)
    .catch(Err)
}

async function count(params) {
  const { challenge_slug, slug } = params

  const challenge_id = await _findChallengeBySlug(challenge_slug)
  const full_slug = await strapi.query('reaction', 'challenges').findOne({ challenge_id, slug }, 'full_slug')

  return strapi.query('reaction', 'challenges').count({ challenge_id, full_slug })
}

async function add(params, body, user, { files = {}, model } = {}) {
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info('creating reaction')

  const now = new Date()
  const { challenge_slug, slug } = params
  const slugPart = _generateSlugPart(now, body.summary)

  const challenge_id = await _findChallengeBySlug(challenge_slug)
  const parentReaction = await strapi
    .query('reaction', 'challenges')
    .model.findOne({ challenge_id, slug })
    .select('challenge_id full_slug depth')
    .exec()

  const parent = parentReaction || { id: null, full_slug: null, depth: 0 }
  const reaction = _buildReaction(challenge_id, slugPart, parent, body, user)

  return strapi.entityService
    .create({ data: reaction, files }, { model })
    .then((persistedReaction) => getOneReaction({ params: { challenge_slug, slug: persistedReaction.slug }, user }))
    .then(Ok)
    .catch((e) => {
      log.warn('Error creating reaction', e)
      return Err(e)
    })
}

const _notFound = () => Err('Reaction not found')

const _updateReaction = async (filter, body, { files, model, source } = {}) => {
  const { challenge_slug, slug } = filter
  const challenge_id = await _findChallengeBySlug(challenge_slug)
  let persistedReaction = strapi.query('reaction', 'challenges').update({ challenge_id, slug }, body)

  if (files) {
    persistedReaction = uploadFiles(persistedReaction, files, model, source)
  }

  return persistedReaction.then(Ok).catch(Err)
}
async function update(params, body, meta, user) {
  const checkPermission = (user, reaction) =>
    ifElse(isOwner(reaction), Right, () => Left(new NotAllowedError('Not allowed to update this Reaction')))(user)

  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`updating reaction ${params.slug}, challenge: ${params.challenge_slug}, user: ${user._id}`)

  const reaction = await fetchOne(params, user)

  return checkPermission(user, reaction).bimap((x) => Promise.reject(x), _updateReaction(params, body, meta))
}

const _remove = async (user, params) => {
  const checkPermission = (challenge, user, reaction) => {
    const isChallengeModerator = isModerator(challenge)
    const isReactionOwner = isOwner(reaction)
    const isStakeHolder = (u) => or(isKvKModerator, or(isChallengeModerator, isReactionOwner))(u)

    return ifElse(isStakeHolder, Right, () => Left(new NotAllowedError('Not allowed to remove this Reaction')))(user)
  }
  const removeReaction = (params, user) => async () => {
    await _updateReaction(params, { status: REMOVED_STATUS, redaction: 'This reaction has been removed.' })
    return fetchOne(params, user)
  }
  const removeIfEligble = (params, challenge, user) => async (reaction) =>
    checkPermission(challenge, user, reaction).bimap((x) => Promise.reject(x), removeReaction(params, user))

  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`removing reaction: ${params} for user ${user._id}`)

  const reaction = await fetchOne(params, user)
  const challengeParams = { slug: params.challenge_slug }
  const challengeResult = await strapi.plugins['challenges'].services.challenges.fetchOne(challengeParams, user)
  const challenge = either(identity, identity, challengeResult)

  return either(identity, identity)(await composeP(either(_notFound, removeIfEligble(params, challenge, user)))(reaction))
}

async function search(params, query) {
  const filters = modelUtils.convertParams('Challenge', params)
  const searchQ = Object.assign({}, params, query)

  const { reaction: Reaction } = strapi.plugins['challenges'].models

  return Reaction.find({ $text: { $search: searchQ._q }, ...filters.where }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip(filters.start)
    .limit(filters.limit)
    .populate(null)
    .then((results) => results.map((result) => (result ? result.toObject() : null)))
    .then(Ok)
    .catch(Err)
}

/* _findPred :: string -> obj -> boolean */
const _findPred = curry((full_slug, item) => item.full_slug === full_slug)
/* _hydrateWithIndex :: (a, Number b) -> Either c d */
const _hydrateWithIndex = curry((value, index) => (index === -1 ? Left({ index, value }) : Right({ index, value })))
/* _findIndex :: (a -> boolean) -> [a] -> Number */
const _findIndex = (fn) => (arr) => _.findIndex(arr, fn)
/**_update :: [a] -> Either b c -> [a] */
const _update = (obj) =>
  either((result) => [...obj, result.value], (result) => [...obj.slice(0, result.index), ...obj.slice(result.index + 1, obj.length)])

const _pin = (op) => async (user, params) => {
  const { slug } = params
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`${op} pin reaction: ${slug}`)

  const serviceName = `${op}s`
  const buildObject = { target: slug, owner_id: user, kind: 'reaction' }
  const existingObject = await strapi.plugins['favorites'].services[serviceName].findOne(slug, user)
  const existing = either(() => false, () => true, existingObject)
  if (existing) {
    return strapi.plugins['favorites'].services[serviceName]
      .remove(existingObject.id)
      .then(() => getOneReaction({ params: { slug }, user }))
      .then(Ok)
      .catch(Err)
  }
  //TODO: extract from pin so the reaction and challenge can use the same pin function.
  // Use compose to enhance this operation for challenges
  return strapi
    .query('reaction', 'challenges')
    .findOne({ slug })
    .then((result) => {
      if (result) {
        return strapi.plugins['favorites'].services[serviceName]
          .create(buildObject)
          .then(() => getOneReaction({ params: { slug: result.slug }, user }))
      }
      throw Err(`No reaction to ${op} provided`)
    })
    .then(Ok)
    .catch(Err)
}

const _patchOperations = {
  highlight: async (user, params) => {
    const { challenge_slug, slug } = params
    const challenge_id = await _findChallengeBySlug(challenge_slug)
    const persistedChallenge = await strapi.query('challenge', 'challenges').model.findOne({ _id: challenge_id })
    const persistedReaction = await strapi.query('reaction', 'challenges').findOne({ challenge_id, slug })

    const highlight = { full_slug: persistedReaction.full_slug, id: persistedReaction.id }

    const updateHighlights = _update(getPathOr([], ['highlights'], persistedChallenge))
    const findHighlightLocation = _findIndex(_findPred(persistedReaction.full_slug))
    const patchValue = compose(
      updateHighlights,
      _hydrateWithIndex(highlight),
      findHighlightLocation
    )

    const updatedValue = patchValue(persistedChallenge.highlights)

    return strapi
      .query('challenge', 'challenges')
      .model.findOneAndUpdate({ _id: challenge_id }, {}, { upsert: true, returnOriginal: false })
      .set('highlights', updatedValue)
      .set('updatedBy', user.id)
      .then(Ok)
      .catch(Err)
  },
  favorite: _pin('favorite'),
  like: _pin('like'),
  remove: _remove
}
const notImplemented = (operation) => () => {
  return Err(`Operation not implemented: ${operation}`)
}

async function patch(params, body, user) {
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`${body.op}:`)

  const fn = getPathOr(notImplemented(body.op), [body.op], _patchOperations)

  return fn(user, params, body).catch(Err)
}

module.exports = {
  fetchAll,
  fetchOne,
  count,
  add,
  update,
  search,
  patch
}
