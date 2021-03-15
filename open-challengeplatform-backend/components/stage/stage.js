const _ = require('lodash')
const isEmpty = require('crocks/predicates/isEmpty')

const DISALLOWED_STAGE_DUPES = ['start', 'end', 'selection']
const _findDuplicates = (dupes, array) =>
  array.filter((value, index, iteratee) => _.find(iteratee, (o) => (dupes.includes(o.type) ? value.type === o.type : false), index + 1))

module.exports = {
  beforeSave: async (model) => {
    if (model.stages) {
      const dupes = _findDuplicates(DISALLOWED_STAGE_DUPES, model.stages)
      if (!isEmpty(dupes)) throw new Error('Illegal duplicate stage found.')
    }
  }
}
