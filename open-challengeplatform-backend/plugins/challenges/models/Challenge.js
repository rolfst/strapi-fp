const eventbus = require('../../../lib/events')

const { getUniqueSlug } = require('../../../lib/slugplugin')
const { addDefaultEnumValues, getModelAttributes } = require('../../../lib/projectKeyUtils')

/**
 * Lifecycle callbacks for the `Challenge` model.
 */

module.exports = {
  // Before saving a value.
  // Fired before an `insert` or `update` query.
  // beforeSave: async (model) => {},
  //
  // After saving a value.
  // Fired after an `insert` or `update` query.
  afterSave: async (model, result) => {
    const events = eventbus.create()
    events.emit('challenge:save', result)
  },
  //
  // Before fetching all values.
  // Fired before a `fetchAll` operation.
  // beforeFetchAll: async (model) => {},
  //
  // After fetching all values.
  // Fired after a `fetchAll` operation.
  // afterFetchAll: async (model, results) => {},
  //
  // Fired before a `fetch` operation.
  // beforeFetch: async (model) => {},
  //
  // After fetching a value.
  // Fired after a `fetch` operation.
  // afterFetch: async (model, result) => {},
  //
  // Before creating a value.
  // Fired before an `insert` query.
  beforeCreate: async (model) => {
    const attributes = await getModelAttributes('challenge')
    model = await addDefaultEnumValues(model, attributes)
    model.slug = await getUniqueSlug({ slugOptions: { "'": '' } }, model.constructor, model.title) // eslint-disable-line
  },
  //
  // After creating a value.
  // Fired after an `insert` query.
  // afterCreate: async (model, result) => {},
  //
  // Before updating a value.
  // Fired before an `update` query.
  beforeUpdate: async (model) => {
    if (model.getUpdate() && model.getUpdate().title) {
      model.update({
        slug: await getUniqueSlug({ slugOptions: { "'": '' } }, model.model, model.getUpdate().title) // eslint-disable-line
      })
    }
  }
  //
  // After updating a value.
  // Fired after an `update` query.
  // afterUpdate: async (model, result) => {},
  //
  // Before destroying a value.
  // Fired before a `delete` query.
  // beforeDestroy: async (model) => {},
  //
  // After destroying a value.
  // Fired after a `delete` query.
  // afterDestroy: async (model, result) => {}
}
