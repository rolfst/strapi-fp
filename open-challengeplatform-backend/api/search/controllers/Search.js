const { defaultResponseSetup } = require('../../../lib/requestUtils')

const identity = require('crocks/combinators/identity')
const liftN = require('crocks/helpers/liftN')
const map = require('crocks/pointfree/map')

const apply = (fn) => (xs) => fn.apply(null, xs)
const _coalesce = (result) => result.coalesce(() => [], identity)
const _merge = (a, b, c) => Object.assign({}, a, b, c)
const _mergeResults = (xs) => apply(liftN(xs.length, _merge))(xs)

async function search(ctx) {
  ctx.log.info('searching challenge')

  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx)
  const challengeService = strapi.plugins['challenges'].services.challenges
  const reactionService = strapi.plugins['challenges'].services.reactions
  const articleService = strapi.plugins['articles'].services.articles
  const user = ctx.user

  const challengeSearch = challengeService.search(ctx.query, ctx.request.body, user)
  const reactionSearch = reactionService.search(ctx.query, ctx.request.body, user)
  const articleSearch = articleService.search(ctx.query, ctx.request.body, user)
  return Promise.all([challengeSearch, reactionSearch, articleSearch])
    .then(([challengeResults, reactionResults, articleResults]) => {
      const searchResults = [
        map((challenges) => ({ challenges }))(_coalesce(challengeResults)),
        map((reactions) => ({ reactions }))(_coalesce(reactionResults)),
        map((articles) => ({ articles }))(_coalesce(articleResults))
      ]
      const result = _mergeResults(searchResults)

      return resolveResult(result)
    })
    .catch(sendInternalErrorResponse)
}

module.exports = {
  search
}
