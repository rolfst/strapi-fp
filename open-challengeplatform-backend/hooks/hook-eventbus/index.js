const { register, emit } = require('./eventbus')

module.exports = (strapi) => {
  async function initialize() {
    strapi.log.info('initializing eventbus')
  }

  return {
    initialize,
    register,
    emit
  }
}
