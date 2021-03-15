'use strict';

/**
 * `inMijnStart` policy.
 */

module.exports = async (ctx, next) => {
  const { host } = ctx.request.header

  if (!host.includes(strapi.config.currentEnvironment.mijnStartHostString)) {
    return ctx.unauthorized('URL can only be accessed within MijnStart')
  }

  return await next()
}
