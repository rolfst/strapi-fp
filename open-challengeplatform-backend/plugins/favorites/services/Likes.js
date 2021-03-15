const { Result } = require('crocks')
const { Err } = Result
const forwardResult = require('../../../lib/forwardResult')

async function findOne(slug, user) {
  return strapi
    .query('like', 'favorites')
    .findOne({ target: slug, owner_id: user })
    .then((favorite) => {
      if (!favorite) throw new Error('No favorite found')
      return favorite
    })
    .then(forwardResult)
    .catch(Err)
}

async function find(slug) {
  return await strapi.query('like', 'favorites').find({ target: slug })
}

async function remove(id) {
  return await strapi.query('like', 'favorites').delete({ id })
  // TODO: fix then/Ok/Err chain. These would currently return 'Ok/Err' OBJECTS instead of desired results.
}

async function create(params) {
  return await strapi.query('like', 'favorites').create(params)
  // TODO: fix then/Ok/Err chain. These would currently return 'Ok/Err' OBJECTS instead of desired results.
}

async function count(params = {}) {
  return strapi.query('like', 'favorites').count(params)
}

/**
 * Likes.js service
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
  find,
  findOne,
  remove,
  create,
  count
}
