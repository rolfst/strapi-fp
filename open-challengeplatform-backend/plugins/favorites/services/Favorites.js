const { Result } = require('crocks')
const { Ok, Err } = Result
const forwardResult = require('../../../lib/forwardResult')

const getPathOr = require('crocks/helpers/getPathOr')
const omit = require('crocks/helpers/omit')
const pick = require('crocks/helpers/pick')

// ['-owner_id'] ----> populate (strapi) currently broken. Workaround.
const _applyOmit = (omitArray) => (favorites) => favorites.map((favorite) => omit(omitArray, favorite))

/**
 * Retrieve a Favorite record.
 * @return {Object}
 */
async function findOne(slug, user) {
  return strapi
    .query('favorite', 'favorites')
    .findOne({ target: slug, owner_id: user })
    .then((favorite) => {
      if (!favorite) throw new Error('No favorite found')
      return favorite
    })
    .then(forwardResult)
    .catch(Err)
}

/**
 * Remove a favorite by id
 * @param {string} id
 */
async function remove(id) {
  return strapi
    .query('favorite', 'favorites')
    .delete({ id })
    .then(forwardResult)
    .catch(Err)
}

async function create(params) {
  return strapi
    .query('favorite', 'favorites')
    .create(params)
    .then(forwardResult)
    .catch(Err)
}

async function count(params = {}) {
  return strapi
    .query('favorite', 'favorites')
    .count(params)
    .then(forwardResult)
    .catch(Err)
}

// Mimic the Patch ops -> get my favorited:  Reactions | Challenges | TBD: Articles)
const _getItemsByTypeOperator = {
  reaction: async (params, user) => strapi.plugins['challenges'].services.reactions.fetchAll(params, { _limit: 100 }, user),
  challenge: async (params, user) => strapi.plugins['challenges'].services.challenges.fetchAll(Object.assign({}, params, { status: 'all' }), {}, user)
}
const notImplemented = (type) => () => Err(`Type operation not implemented: ${type}`)

// 'params.kind' ==> 'type'
const _findFavoritedItems = (type, user = {}) => async (favorites) => {
  const targets = favorites.map((favorite) => pick(['target'], favorite))

  const fn = getPathOr(notImplemented(type), [type], _getItemsByTypeOperator)
  return targets.length ? fn(targets, user) : Ok([])
}

async function find(params = {}, omitArray = [], user = {}) {
  const omitFavorites = _applyOmit(omitArray)
  const findFavoritedItems = _findFavoritedItems(params.kind, user)

  return strapi
    .query('favorite', 'favorites')
    .find(params)
    .then(omitFavorites)
    .then(findFavoritedItems)
    .then(forwardResult)
    .catch(Err)
}

async function findIds(params) {
  return strapi.query('favorite', 'favorites').find(params)
}

module.exports = {
  findIds,
  remove,
  create,
  findOne,
  find,
  count
}
