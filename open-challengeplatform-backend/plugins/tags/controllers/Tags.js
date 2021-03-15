const { defaultResponseSetup } = require('../../../lib/requestUtils')

/**
 * Default action.
 *
 * @return {Object}
 */
function index(ctx) {
  const send = (ctx) => (tags) => ctx.send({ tags })
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx, send)

  return strapi.plugins['tags'].services.tags
    .fetchAll(ctx.request.params, ctx.request.query)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

/**
 * Tags.js controller
 *
 * @description: A set of functions called "actions" of the `tags` plugin.
 */

module.exports = {
  index
}
