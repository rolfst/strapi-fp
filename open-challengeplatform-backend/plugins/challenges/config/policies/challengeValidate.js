const _ = require('lodash')
const isEmpty = require('crocks/predicates/isEmpty')

const DISALLOWED_STAGE_DUPES = ['start', 'end', 'selection']
const _findDuplicates = (dupes, array) => {
  if (!array) return []
  return array.filter((value, index, iteratee) => _.find(iteratee, (o) => (dupes.includes(o.type) ? value.type === o.type : false), index + 1))
}

module.exports = async (ctx, next) => {
  const dupes = _findDuplicates(DISALLOWED_STAGE_DUPES, ctx.bc_content.data.stages)
  if (!isEmpty(dupes)) return ctx.badRequest('Illegal duplicate stage found.')
  await next()
}
