const { defaultResponseSetup } = require('../../../lib/requestUtils')

const MODEL = 'plugins::challenges.challenge'
const SOURCE = 'challenges'

async function findOne(ctx) {
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx)

  return strapi.plugins['challenges'].services.challenges
    .fetchOne(ctx.params, ctx.user)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

async function findArticles(ctx) {
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx)

  return strapi.plugins['challenges'].services.challenges
    .fetchArticles(ctx.params, ctx.query)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

async function findArticle(ctx) {
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx)

  return strapi.plugins['challenges'].services.challenges
    .fetchArticle(ctx.params, ctx.query)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

async function findHighlights(ctx) {
  ctx.log.info('fetching highlights of challenge')

  const send = (ctx) => (highlights) => ctx.send({ highlights })
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx, send)

  return strapi.plugins['challenges'].services.challenges
    .fetchHighlights(ctx.params, ctx.query, ctx.user)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

async function findParticipants(ctx) {
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx)
  const { params, user } = ctx

  return strapi.plugins['challenges'].services.challenges
    .fetchParticipants(params, user)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

async function index(ctx) {
  ctx.log.info('fetching challenges')

  const send = (ctx) => (challenges) => ctx.send({ challenges })
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx, send)

  return strapi.plugins['challenges'].services.challenges
    .fetchAll(ctx.request.params, ctx.request.query)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

async function create(ctx) {
  ctx.log.info('creating challenge')

  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx)
  const challengeService = strapi.plugins['challenges'].services.challenges

  let challengeCreation
  if (ctx.is('multipart')) {
    const { data, files } = ctx.bc_content
    challengeCreation = challengeService.add(data, { files, model: MODEL, source: SOURCE }, ctx.user)
  } else {
    challengeCreation = challengeService.add(ctx.bc_content.data, { model: MODEL, source: SOURCE }, ctx.user)
  }

  return challengeCreation.then(resolveResult).catch(sendInternalErrorResponse)
}

async function update(ctx) {
  ctx.log.info('updating challenge')

  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx)
  const challengeService = strapi.plugins['challenges'].services.challenges
  const params = ctx.params

  let challengeCreation
  if (ctx.is('multipart')) {
    const { data, files } = ctx.bc_content
    challengeCreation = challengeService.update(params, data, { files, model: MODEL, source: SOURCE }, ctx.user)
  } else {
    challengeCreation = challengeService.update(ctx.bc_content.data, { model: MODEL, source: SOURCE }, ctx.user)
  }

  return challengeCreation.then(resolveResult).catch(sendInternalErrorResponse)
}

async function patch(ctx) {
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx)
  const { body } = ctx.request
  const user = ctx.user

  return strapi.plugins['challenges'].services.challenges
    .patch(ctx.params, body, user)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

async function search(ctx) {
  ctx.log.info('searching challenge')

  const send = (ctx) => (challenges) => ctx.send({ challenges })
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx, send)
  const challengeService = strapi.plugins['challenges'].services.challenges
  const user = ctx.user

  const challengeSearch = challengeService.search(ctx.query, ctx.request.body, user)

  return challengeSearch.then(resolveResult).catch(sendInternalErrorResponse)
}

/**
 * Challenges.js controller
 *
 * @description: A set of functions called "actions" of the `kvk-challenges` plugin.
 */
module.exports = {
  index,
  findArticles,
  findArticle,
  findParticipants,
  findHighlights,
  create,
  findOne,
  search,
  update,
  patch
}
