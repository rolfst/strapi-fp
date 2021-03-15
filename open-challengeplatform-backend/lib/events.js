const isDefined = require('crocks/predicates/isDefined')

function create() {
  const hook = strapi.hook['hook-eventbus'] || null
  return isDefined(hook) ? { register: hook.register, emit: hook.emit } : { register: () => {}, emit: () => {} }
}

module.exports = {
  create
}
