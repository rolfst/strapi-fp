const rtracer = require('cls-rtracer')
const _create = (context) => async (xml) => create(context, xml)

/**
 * /crm/connect route
 * @return { Object }
 */
async function connect(ctx) {
  const { kvkmasterid } = ctx.request.header
  const log = strapi.log.child({ traceId: rtracer.id() })
  const _createInContext = _create(ctx)

  // Check if the user exists.
  return strapi.plugins['users-permissions'].services.user
    .fetchUserById({ kvkmasterid })
    .then((user) => {
      if (!user) {
        return strapi.plugins['users-permissions'].services.user
          .getCrmUserData(kvkmasterid)
          .then(_createInContext)
          .catch((err) => {
            log.info(err)
            throw `Error while trying to retrieve user from CRM: ${rtracer.id()}`
          })
      }
      return user
    })
    .then(strapi.plugins['users-permissions'].services.user.sanitizeUser)
}

/**
 * Create a/an user record.
 * @return {Object}
 */
async function create(ctx, parsedXml) {
  const { kvkmasterid } = ctx.request.header
  if (!kvkmasterid) return ctx.badRequest('missing.kvkmasterid')

  // check if the user already exists
  return strapi.plugins['users-permissions'].services.user
    .fetchUserById({ kvkmasterid })
    .then((existingUser) => {
      if (existingUser) {
        throw new Error('kvkmasterid already taken.')
      }
    })
    .then(async () => {
      let newUser = {
        kvkmasterid: kvkmasterid,
        provider: 'crm',
        confirmed: true
      }

      const defaultRole = strapi.config.currentEnvironment.defaultRole || 'participant'

      newUser.role = await strapi.query('role', 'users-permissions').findOne({ type: defaultRole }, [])
      newUser = strapi.plugins['users-permissions'].services.user.addParsedRelatieXmlToUser(newUser, parsedXml)

      return strapi.plugins['users-permissions'].services.user
        .add(newUser)
        .catch((error) => {
          throw new Error(error)
        })
    })
    .catch((error) => ctx.badRequest(error))
}

module.exports = {
  connect
}
