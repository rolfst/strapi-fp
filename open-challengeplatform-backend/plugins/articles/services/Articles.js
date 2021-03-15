const { models: modelUtils } = require('strapi-utils')
const forwardResult = require('../../../lib/forwardResult')
const { Result } = require('crocks')
const { Ok, Err } = Result

const _validateFindOne = (article) => {
  if (!article) throw new Error('Article does not exist')
  return article
}
const _flattenArticle = (article) => {
  if (article.challenge_id) article.challenge_id = article.challenge_id.slug
  return article
}
const _flattenArticleArray = (articles = []) => {
  articles.map((item) => {
    if (item.challenge_id) item.challenge_id = item.challenge_id.slug
    delete item.body
  })
  return articles
}

/**
 * @description: Interal API call: does not have have the ThenOk/Err chain because of cross-service issues.
 * @return { Article[] }
 */
async function fetch(params = {}, query = {}) {
  const combinedParams = Object.assign({}, params, query)
  return strapi
    .query('article', 'articles')
    .find(combinedParams)
    .then(_flattenArticleArray)
    .then(forwardResult)
    .catch(Err)
}

async function create(body) {
  return strapi
    .query('article', 'articles')
    .create(body)
    .then(forwardResult)
    .catch(Err)
}

/**
 * @description: Interal API call: does not have have the ThenOk/Err chain because of cross-service issues.
 * @return { Article }
 */
async function fetchOne(params = {}) {
  return strapi
    .query('article', 'articles')
    .findOne(params)
    .then(_validateFindOne)
    .then(_flattenArticle)
    .then(forwardResult)
    .catch(Err)
}

async function search(params, query) {
  const filters = modelUtils.convertParams('Challenge', params)
  const searchQ = Object.assign({}, params, query)

  const { article: Article } = strapi.plugins['articles'].models

  return Article.find({ $text: { $search: searchQ._q }, ...filters.where }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip(filters.start)
    .limit(filters.limit)
    .populate(null)
    .then((results) => results.map((result) => (result ? result.toObject() : null)))
    .then(forwardResult)
    .catch(Err)
}

module.exports = {
  create,
  fetch,
  fetchOne,
  search
}
