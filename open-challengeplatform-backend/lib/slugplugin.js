const { isEmpty } = require('crocks/predicates')
const slug = require('speakingurl')

const _isEmptyString = (str) => typeof str === 'string' && !isEmpty(str)

const getUniqueSlug = async (options, model, str, i = 0) => {
  const config = {
    slugField: 'slug',
    slugOptions: {},
    ...options
  }
  if (!_isEmptyString(str)) throw new Error('The `str` argument was missing')
  const search = i === 0 ? slug(str, config.slugOptions) : slug(`${str}-${i}`, config.slugOptions)
  const query = { [config.slugField]: search, _id: { $ne: model.id } }

  const count = await model.countDocuments(query)
  if (count === 0) return search
  return getUniqueSlug(config, model, str, i + 1)
}

module.exports = {
  getUniqueSlug
}
