const _getPluginSource = {
  challenge: { model: 'challenge', plugin: 'challenges' },
  reaction: { model: 'reaction', plugin: 'challenges' },
  user: { model: 'user', plugin: 'users-permissions' }
}

async function getModelAttributes(name) {
  const { model, plugin } = _getPluginSource[name]
  return await strapi.query(model, plugin).model.attributes
}

// we have to update de model in-place to properly work with mongoose
async function addDefaultEnumValues(model = {}, attributes = {}) {
  Object.entries(attributes).reduce((acc, entry) => {
    const [key, value] = entry
    if (value.type === 'enumeration' && value.default) {
      model[key] = model[key] && value.enum.includes(model[key]) ? model[key] : value.default
    }
  })
  return model
}

/**
 * @description Create a new Object{} to transform into a simple project key Obj based on input Obj{}
 * @returns { Object{ key: 1, key: 1, ... } }
 */
function toProjectionSettings(attributes = {}) {
  return Object.entries(attributes).reduce((acc, entry) => {
    const [key, value] = entry
    if (!Object.prototype.hasOwnProperty.call(value, 'private') || !value.private) acc[key] = 1
    return acc
  }, {})
}

module.exports = {
  addDefaultEnumValues,
  getModelAttributes,
  toProjectionSettings
}
