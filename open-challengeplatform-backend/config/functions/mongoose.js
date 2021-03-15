const { callbackify } = require('util')

const { isEmpty } = require('crocks/predicates')

const _isEmptyString = (str) => typeof str === 'string' && !isEmpty(str)
const _ = require('lodash')
const slug = require('speakingurl')

// eslint-disable-next-line max-params
const getUniqueSlug = async (config, constructor, _id, str, i = 0) => {
  if (!_isEmptyString(str)) throw new Error('The `str` argument was missing')
  const search = i === 0 ? str : config.slug(`${str}-${i}`, config.slugOptions)
  const query = { _id: { $ne: _id } }
  query[config.slugField] = search
  if (config.paranoid === 'hidden') query.hidden = { $ne: null }
  const count = await constructor.countDocuments(query)
  if (count === 0) return search
  return getUniqueSlug(config, constructor, _id, str, i + 1)
}

const slugPlugin = (models) => {
  const mongooseSlugPlugin = (schema, options = {}) => {
    const config = {
      tmpl: '<%=title%>',
      locals: {},
      alwaysUpdateSlug: true,
      slug,
      errorMessage: 'Slug was missing or blank',
      logger: console,
      slugField: 'slug',
      i18n: false,
      slugOptions: { "'": '' },
      paranoid: false,
      ...options
    }

    const obj = {}
    obj[config.slugField] = {
      type: String,
      index: true,
      unique: true,
      required: () => { debugger; models.includes(this.constructor.modelName)},//false,
      trim: true,
      set: (val) => config.slug(val, config.slugOptions),
      validate: {
        validator(val) {
          const message = config.i18n && config.i18n.t && this.locale ? config.i18n.t(config.errorMessage, this.locale) : config.errorMessage
          if (!_isEmptyString(val)) return Promise.reject(message)
          Promise.resolve(true)
        }
      }
    }

    schema.add(obj)

    schema.pre('validate', async function(next) {
      if (!models.includes(this.constructor.modelName)) return
      try {
        const locals = { ...config.locals, ...this.toObject() }
        const str = _.template(config.tmpl)(locals)

        // set the slug if it is not already set
        if (!_isEmptyString(this[config.slugField]) || config.alwaysUpdateSlug) {
          this[config.slugField] = config.slug(str, config.slugOptions)
        } else {
          // slugify the slug in case we set it manually and not in slug format
          this[config.slugField] = config.slug(this[config.slugField], config.slugOptions)
        }

        // ensure that the slug is unique
        const uniqueSlug = await getUniqueSlug(config, this.constructor, this._id, this[config.slugField])
        this[config.slugField] = uniqueSlug


        next()
      } catch (err) {
        config.logger.error(err)
        if (config.i18n && config.i18n.t && this.locale) err.message = config.i18n.t(config.errorMessage, this.locale)
        else err.message = config.errorMessage
        next(err)
      }
    })

    schema.statics.getUniqueSlug = function(_id, str) {
      str = config.slug(str, config.slugOptions)
      return getUniqueSlug(config, this, _id, str)
    }

    schema.statics.getUniqueSlugCallback = callbackify(schema.statics.getUniqueSlug)

    return schema
  }
  return mongooseSlugPlugin
}

module.exports = (mongoose, connection) => {
}
