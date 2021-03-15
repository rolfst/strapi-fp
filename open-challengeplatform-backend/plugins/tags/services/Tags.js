const { buildQuery, convertRestQueryParams } = require('strapi-utils')
const rtracer = require('cls-rtracer')

const isEmpty = require('crocks/predicates/isEmpty')

const Result = require('crocks/Result')
const { Ok, Err } = Result

/**
 * Create a Tag.
 * @param body - Tag
 * @return {Promise} Result
 */
async function add(body) {
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info('finding tags')

  return strapi
    .query('tag', 'tags')
    .create(body)
    .then(Ok)
    .catch((e) => {
      log.warn('Error creating challenge', e)
      return Err(e)
    })
}

/**
 * @description: fetches all Tags
 * @return {Promise} Result
 */
async function fetchAll(params, query = {}) {
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info('finding tags')

  const filters = convertRestQueryParams(query)

  const { tag: Tag } = strapi.plugins['tags'].models
  const queryBuild = buildQuery({
    model: Tag,
    filters,
    populate: null
  })

  return queryBuild
    .lean()
    .then(Ok)
    .catch(Err)
}

async function findOne(params) {
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info('finding single tag')

  return strapi.query('tag', 'tags').findOne(params)
}

async function updateTags(tags) {
  strapi.log.info('tags: ', tags)

  if (!isEmpty(tags)) {
    const { tag: Tag } = strapi.plugins['tags'].models
    const tagsToBeCreated = tags.map((tag) => ({ title: tag }))
    Tag.create(tagsToBeCreated).catch((e) => {
      if (!e.message.includes('E11000')) strapi.log.warn(`Error updating tag: ${e}`)
    })
  }
}

/**
 * Tags.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */
module.exports = {
  fetchAll,
  findOne,
  add,
  updateTags
}
