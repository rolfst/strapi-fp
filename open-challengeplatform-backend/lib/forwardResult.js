const { Assign, Result } = require('crocks')
const isSameType = require('crocks/predicates/isSameType')

const { Ok } = Result

module.exports = (result) =>
  Assign(Ok([]))
    .concat(Assign(isSameType(Result, result) ? result : Ok(result)))
    .valueOf()
