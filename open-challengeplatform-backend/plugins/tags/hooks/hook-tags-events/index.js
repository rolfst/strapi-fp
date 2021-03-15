const rtracer = require('cls-rtracer')
const eventbus = require('../../../../lib/events')

module.exports = (strapi) => {
  async function initialize() {
    strapi.log.info('initializing tags hooks')

    const events = eventbus.create()
    events.register('challenge:save', (challenge) => {
      const log = strapi.log.child({ traceId: rtracer.id() })
      log.info('updating tags', challenge._id)

      const { tags } = challenge
      strapi.plugins['tags'].services.tags.updateTags(tags)
    })
  }

  return {
    initialize
  }
}
