'use strict'

/**
 * `crmOptional interceptor` policy.
 *
 *  @description adds the 'user' based on kvkMasterId, but only if provided. Not mandatory.
 */

module.exports = async (ctx, next) => {
  if (ctx.request.header.kvkmasterid) {
    await strapi.plugins['users-permissions'].services.crm.connect(ctx).then((user) => {
      ctx.user = user
    })
  }

  return next()
}
