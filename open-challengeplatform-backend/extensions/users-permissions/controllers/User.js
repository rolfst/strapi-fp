const MODEL = 'user'
const SOURCE = 'users-permissions'

const { defaultResponseSetup } = require('../../../lib/requestUtils')
/**
 * Retrieve authenticated user.
 * @return {Object|Array}
 */
async function me(ctx) {
  const { kvkmasterid } = ctx.header
  const userService = strapi.plugins['users-permissions'].services.user

  return userService
    .fetchUserById({ kvkmasterid })
    .then(userService.addCrmRelatieData)
    .then(userService.filterHiddenFields)
    .then((user) => ctx.send(user))
    .catch((err) => ctx.badRequest(err))
}

/**
 * Retrieve a user record.
 * @return {Object}
 */
async function findOne(ctx) {
  const { params } = ctx
  const currentUser = ctx.user
  const userService = strapi.plugins['users-permissions'].services.user

  return userService
    .fetchUserById(params)
    .then(userService.addCrmRelatieData)
    .then(userService.filterHiddenFields)
    .then((user) => userService.applyAuthenticationFilter(user, currentUser))
    .then(userService.sanitizeUser)
    .then((user) => ctx.send(user))
    .catch((err) => ctx.badRequest(err))
}

async function updateProfilePicture(ctx) {
  if (ctx.is('multipart')) {
    const { files } = ctx.bc_content
    const user = ctx.user

    return strapi.plugins['users-permissions'].services.user.uploadProfilePicture(user, {
      files,
      model: MODEL,
      source: SOURCE
    })
  }

  throw new Error('request failed: non-multiPart')
}

async function findModerators(ctx) {
  ctx.log.info('fetching challenges')
  const { params } = ctx
  const user = ctx.user


  const send = (ctx) => (moderators) => ctx.send({ moderators })
  const { sendInternalErrorResponse, resolveResult } = defaultResponseSetup(ctx, send)

  const userService = strapi.plugins['users-permissions'].services.user

  return userService
    .fetchModerators(params, user)
    .then(resolveResult)
    .catch(sendInternalErrorResponse)
}

module.exports = {
  me,
  findOne,
  findModerators,
  updateProfilePicture
}
