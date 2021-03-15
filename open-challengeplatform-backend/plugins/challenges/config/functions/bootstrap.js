const _ = require('lodash')
const Promise = require('bluebird')
const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

/* eslint-disable-next-line quotes */
const TO_BE_CREATED_INDICES = {
  challenge: { title_text_body_text: { index: { title: 'text', body: 'text' }, options: { weights: { title: 1, body: 2 } } } },
  reaction: { title_text_summary_text: { index: { title: 'text', summary: 'text' }, options: { weights: { title: 1, summary: 2 } } } },
  filter: { filter_1_method_1: { index: { filter: 1, method: 1 }, options: { unique: true } } }
}

const _find = async (query) => query.find()

module.exports = async () => {
  const ChallengeModel = strapi.query('challenge', 'challenges').model
  const ReactionModel = strapi.query('reaction', 'challenges').model
  const FilterModel = strapi.query('filter', 'challenges').model

  const loadIndices = strapi.config.functions['loadindices']('challenges')
  try {
    await loadIndices(TO_BE_CREATED_INDICES)
  } catch (e) {
    await ChallengeModel.createCollection()
    await ReactionModel.createCollection()
    await FilterModel.createCollection()
    await loadIndices(TO_BE_CREATED_INDICES)
  }

  const roles = strapi.config.currentEnvironment.roles
  const filters = strapi.config.currentEnvironment.filters

  const roleQuery = strapi.query('role', 'users-permissions')
  const filterQuery = strapi.query('filter', 'challenges')

  const { newRoles, newFilters } = await setTimeoutPromise(40).then(async () => {
    const existingRoles = await _find(roleQuery)
    const newRoles = _.differenceWith(roles, existingRoles, (a, b) => a === b.name)

    const existingFilters = await _find(filterQuery)
    const newFilters = _.differenceWith(filters, existingFilters, (a, b) => a.filter === b.filter && _.isEqual(a.roles, b.roles))
    return { newRoles, newFilters }
  })
  await Promise.map(newRoles, (name) => roleQuery.create({ name, type: name }))
  await Promise.map(newFilters, (filter) => filterQuery.create(filter))
}
