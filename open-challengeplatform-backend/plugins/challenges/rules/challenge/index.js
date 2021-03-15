const { Maybe } = require('crocks')

const alt = require('crocks/pointfree/alt')
const compose = require('crocks/helpers/compose')
const ifElse = require('crocks/logic/ifElse')
const isEmpty = require('crocks/predicates/isEmpty')
const map = require('crocks/pointfree/map')
const not = require('crocks/logic/not')
const propEq = require('crocks/predicates/propEq')

const { Just, Nothing } = Maybe

/* basic */
const _arrOnCondition = (fn) =>
  compose(
    alt(Maybe.of([])),
    map(Array.of),
    fn
  )
const _avail = not(isEmpty)
const evaluation = (condition) => ifElse(condition, Just, Nothing)
const _ruleComposer = (morph, evaluator) =>
  compose(
    map(morph),
    evaluator
  )

/* sorting */
const _hasRandomSorting = propEq('sort', 'random')
const sortRule = () => ({ $sample: { size: 10 } })
const _sorting = _ruleComposer(sortRule, evaluation(_hasRandomSorting))
const buildSorting = _arrOnCondition(_sorting)

/* logged in */
const interestRule = ({ interests }) => ({ interests: { $in: interests } })
const _availableInterests = _ruleComposer(interestRule, evaluation(_avail))
const buildInterrests = _arrOnCondition(_availableInterests)

module.exports = {
  buildInterrests,
  buildSorting,
  evaluation
}
