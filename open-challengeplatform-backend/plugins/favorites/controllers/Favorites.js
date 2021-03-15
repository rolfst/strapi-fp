const { defaultResponseSetup, sendBadRequest } = require('../../../lib/requestUtils')
const defaultOmit = ['owner_id', 'createdAt', 'updatedAt']

async function findFavorites(ctx) {
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx)
  const kind = ctx.query.type
  const owner = ctx.user._id

  if (!kind) return sendBadRequest(ctx)(new Error('please provide a Type (query) of favorite'))

  return strapi.plugins['favorites'].services.favorites
    .find({ owner_id: owner, kind }, defaultOmit, ctx.user)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

module.exports = {
  findFavorites
}
