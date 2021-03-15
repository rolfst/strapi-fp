const rtracer = require('cls-rtracer')

module.exports = (strapi) => {
  strapi.log.info('initializing logging traceId')

  return {
    /**
     *  Initialize the hook
     */
    initialize() {
      const { exposeInContext } = strapi.config.middleware.settings.logger

      const oldLog = strapi.log

      strapi.app.use(rtracer.koaMiddleware())

      if (exposeInContext) {
        strapi.app.use(async (ctx, next) => {
          strapi.log = oldLog.child({ traceId: rtracer.id() })
          strapi.app.context.log = strapi.log.child({ traceId: rtracer.id() })
          return next()
        })
      }
    }
  }
}
