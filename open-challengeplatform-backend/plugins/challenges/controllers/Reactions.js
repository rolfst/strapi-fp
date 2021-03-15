const { defaultResponseSetup } = require('../../../lib/requestUtils')

const MODEL = 'plugins::challenges.reaction'
const SOURCE = 'challenges'

async function index(ctx) {
  const send = (ctx) => (reactions) => ctx.send({ reactions })
  const { sendInternalErrorResponse, resolveResult: resolveReactions } = defaultResponseSetup(ctx, send)

  strapi.log.info('in service to fetch')
  return strapi.plugins['challenges'].services.reactions
    .fetchAll(ctx.params, ctx.query, ctx.user)
    .then(resolveReactions)
    .catch(sendInternalErrorResponse)
}

async function findOne(ctx) {
  const { sendInternalErrorResponse, resolveResult: resolveChallenge } = defaultResponseSetup(ctx)

  return strapi.plugins['challenges'].services.reactions
    .fetchOne(ctx.params, ctx.user)
    .then(resolveChallenge)
    .catch(sendInternalErrorResponse)
}

async function count(ctx) {
  return strapi.plugins['challenges'].services.reactions.count(ctx.request.query)
}

async function create(ctx) {
  const { sendInternalErrorResponse, resolveResult: resolveReaction } = defaultResponseSetup(ctx)
  const reactionService = strapi.plugins['challenges'].services.reactions

  let storedReaction
  if (ctx.is('multipart')) {
    const { body, files } = ctx.request
    storedReaction = reactionService.add(ctx.params, body, ctx.user, {
      files,
      model: MODEL,
      source: SOURCE
    })
  } else {
    storedReaction = reactionService.add(ctx.params, ctx.request.body, ctx.user, {
      model: MODEL,
      source: SOURCE
    })
  }

  return storedReaction.then(resolveReaction).catch(sendInternalErrorResponse)
}

async function update(ctx) {
  const { sendInternalErrorResponse, resolveResult: resolveReaction } = defaultResponseSetup(ctx)
  const id = ctx.body.slug
  const reactionService = strapi.plugins['challenges'].services.reactions

  return reactionService
    .update(id, ctx.query)
    .then(resolveReaction)
    .catch(sendInternalErrorResponse)
}

async function remove(ctx) {
  return strapi.plugins['challenges'].services.reactions.remove(ctx.query)
}

async function patch(ctx) {
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx)
  const { body } = ctx.request
  const user = ctx.user

  return strapi.plugins['challenges'].services.reactions
    .patch(ctx.params, body, user)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

async function search(ctx) {
  ctx.log.info('searching reactions')

  const send = (ctx) => (reactions) => ctx.send({ reactions })
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx, send)
  const reactionService = strapi.plugins['challenges'].services.reactions
  const user = ctx.user

  const reactionSearch = reactionService.search(ctx.query, ctx.request.body, user)

  return reactionSearch.then(resolveResult).catch(sendInternalErrorResponse)
}

/**
 * Read the documentation () to implement custom controller functions
 */
module.exports = {
  index,
  findOne,
  count,
  create,
  update,
  remove,
  search,
  patch
}
