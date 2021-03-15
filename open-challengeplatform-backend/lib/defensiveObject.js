function createDefensiveObject(target, alt) {
  if (!alt) throw new Error('default needs to be provided')

  return new Proxy(target, {
    get: function(target, property) {
      if (property in target) {
        return target[property]
      } else {
        return alt
      }
    }
  })
}

module.exports = createDefensiveObject
