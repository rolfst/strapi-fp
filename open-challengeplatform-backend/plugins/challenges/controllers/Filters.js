const { defaultResponseSetup } = require('../../../lib/requestUtils')

async function index(ctx) {
  ctx.log.info('fetching filters')

  const send = (ctx) => (filters) => ctx.send({ filters })
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx, send)

  return strapi.plugins['challenges'].services.filters
    .fetchAll(ctx.request.params, ctx.request.query, ctx.user)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

module.exports = {
  index
}
