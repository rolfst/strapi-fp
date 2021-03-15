/**
 * `crmInterceptor` policy.
 *
 * @description adds the 'user' based on the provided 'kvkmasterid'.
 */

module.exports = async (ctx, next) => {
  const { kvkmasterid } = ctx.request.header

  if (!kvkmasterid) return ctx.badRequest('Please provide your kvkmasterid.')

  return strapi.plugins['users-permissions'].services.crm
    .connect(ctx)
    .then((user) => {
      ctx.user = user
      return next()
    })
    .catch((err) => ctx.badRequest(err))
}
