const _ = require('lodash')
const bluebird = require('bluebird')

module.exports = (moduleName) => async (moduleIndexes) => {
  const indexes = await Promise.all(
    _.map(moduleIndexes, async (indexConfig, key) => {
      const model = await strapi.query(key, moduleName).model
      return Object.assign({}, { indexConfig, model })
    })
  )

  const newIndexes = await bluebird.reduce(
    indexes,
    async (acc, possibleIndex) => {
      const idx = await possibleIndex.model.listIndexes()
      const nIdx = Object.keys(possibleIndex.indexConfig)
      const diff = _.differenceWith(nIdx, idx, (a, b) => a === b.name)
      const entry = { model: possibleIndex.model }
      const newIndx = diff.map((ind) => possibleIndex.indexConfig[ind])

      if (!_.isEmpty(diff)) acc.push(Object.assign({}, entry, { newIndx }))

      return acc
    },
    []
  )
  await bluebird.reduce(
    newIndexes,
    async (acc, index) => {
      const { model } = index
      const newIndx = index.newIndx
      const creations = newIndx.map((i) => model.collection.createIndex(i.index, i.options))
      return acc.concat(creations)
    },
    []
  )
  if (_.isEmpty(newIndexes)) {
    strapi.log.info(`No indices to be created for: ${moduleName}`)
  } else {
    strapi.log.info(`Created indices for: ${moduleName}`)
  }
}
