const { defaultResponseSetup } = require('../../../lib/requestUtils')

async function find(ctx) {
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx)

  return strapi.plugins['articles'].services.articles
    .fetch(ctx.params, ctx.query)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

async function findOne(ctx) {
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx)

  return strapi.plugins['articles'].services.articles
    .fetchOne(ctx.params)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

async function create(ctx) {
  ctx.log.info('creating article')
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx)

  return strapi.plugins['articles'].services.articles
    .create(ctx.request.body)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

async function search(ctx) {
  ctx.log.info('searching articles')

  const send = (ctx) => (articles) => ctx.send({ articles })
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx, send)
  const articleService = strapi.plugins['articles'].services.articles
  const user = ctx.user

  const articleSearch = articleService.search(ctx.query, ctx.request.body, user)

  return articleSearch.then(resolveResult).catch(sendInternalErrorResponse)
}

module.exports = {
  create,
  find,
  findOne,
  search
}
