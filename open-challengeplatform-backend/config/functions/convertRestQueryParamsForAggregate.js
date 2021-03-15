/**
 * Converts the standard Strapi REST query params to a moe usable format for querying
 * You can read more here: https://strapi.io/documentation/3.0.0-beta.x/guides/filters.html
 */

const _ = require('lodash')
const setProp = require('crocks/helpers/setProp')

const isNumeric = (num) => (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) && !isNaN(num)
/**
 * Global convertor
 * @param {Object} params
 */
const convertRestQueryParams = (params = {}) => {
  if (typeof params !== 'object' || params === null) {
    throw new Error(`convertRestQueryParams expected an object got ${params === null ? 'null' : typeof params}`)
  }

  let basics = []

  if (Object.keys(params).length === 0) {
    return basics
  }

  if (_.has(params, '_sort')) {
    basics = setProp(0, convertSortQueryParams(params._sort), basics)
  }
  basics = setProp(basics.length, convertStartQueryParams(params._start), basics)

  basics = setProp(basics.length, convertLimitQueryParams(params._limit), basics)

  const whereParams = _.omit(params, ['_sort', '_start', '_limit'])

  if (_.keys(whereParams).length > 0) {
    const $match = {
      $match: { $and: convertWhereParams(whereParams) }
    }
    return [$match].concat(basics)
  }
  return basics
}

const SORT_KEYS = {
  asc: 1,
  desc: -1
}
/**
 * Sort query parser
 * @param {string} sortQuery - ex: id:asc,price:desc
 */
const convertSortQueryParams = (sortQuery) => {
  if (typeof sortQuery !== 'string') {
    throw new Error(`convertSortQueryParams expected a string, got ${typeof sortQuery}`)
  }

  const sortKeys = {}

  sortQuery.split(',').forEach((part) => {
    // split field and order param with default order to ascending
    const [field, order = SORT_KEYS['asc']] = part.split(':')

    if (field.length === 0) {
      throw new Error('Field cannot be empty')
    }

    if (!['asc', 'desc'].includes(order.toLocaleLowerCase())) {
      throw new Error('order can only be one of asc|desc|ASC|DESC')
    }

    sortKeys[field] = SORT_KEYS[order.toLowerCase()]
  })

  return {
    $sort: sortKeys
  }
}

/**
 * Start query parser
 * @param {string} startQuery - ex: id:asc,price:desc
 */
const convertStartQueryParams = (startQuery) => {
  const startAsANumber = _.toNumber(startQuery) || 0

  if (!_.isInteger(startAsANumber) || startAsANumber < 0) {
    throw new Error(`convertStartQueryParams expected a positive integer got ${startAsANumber}`)
  }

  return {
    $skip: startAsANumber
  }
}

/**
 * Limit query parser
 * @param {string} limitQuery - ex: id:asc,price:desc
 */
const convertLimitQueryParams = (limitQuery) => {
  const limitAsANumber = _.toNumber(limitQuery) || 100

  if (!_.isInteger(limitAsANumber) || (limitAsANumber !== -1 && limitAsANumber < 0)) {
    throw new Error(`convertLimitQueryParams expected a positive integer got ${limitAsANumber}`)
  }

  return {
    $limit: limitAsANumber
  }
}

const convertValue = (value) => (isNumeric(value) ? Number(value) : value)
// List of all the possible filters
const VALID_OPERATORS = {
  eq: (field, value) => ({ [field]: { $eq: convertValue(value) } }),
  ne: (field, value) => ({ [field]: { $not: { $eq: convertValue(value) } } }),
  in: (field, value) => ({ [field]: { $in: value.split(',').map(convertValue) } }),
  nin: (field, value) => ({ $not: { $in: [`$${field}`, value.split(',').map(convertValue)] } }),
  contains: (field, value) => ({ [field]: { $regex: value, $options: 'mg' } }),
  ncontains: (field, value) => ({ [field]: { $not: { $regex: value, $options: 'mg' } } }),
  containss: (field, value) => ({ [field]: { $regex: value, $options: 'img' } }),
  ncontainss: (field, value) => ({ [field]: { $not: { $regex: value, $options: 'img' } } }),
  lt: (field, value) => {
    const test = isNumeric(value) ? Number(value) : value
    return { [field]: { $lt: test } }
  },
  lte: (field, value) => {
    const test = isNumeric(value) ? Number(value) : value
    return { [field]: { $lte: test } }
  },
  gt: (field, value) => {
    const test = isNumeric(value) ? Number(value) : value
    return { [field]: { $gt: test } }
  },
  gte: (field, value) => {
    const test = isNumeric(value) ? Number(value) : value
    return { [field]: { $gte: test } }
  },
  null: (field) => {
    // eslint-disable-line
    const obj = {}
    obj[`${field}`] = null
    return obj
  }
}

/**
 * Parse where params
 */
const convertWhereParams = (whereParams) => {
  let finalWhere = []

  Object.keys(whereParams).forEach((whereClause) => {
    const { field, operator = 'eq', value } = convertWhereClause(whereClause, whereParams[whereClause])

    finalWhere.push(VALID_OPERATORS[operator](field, value))
  })

  return finalWhere
}
/**
 * Parse single where param
 * @param {string} whereClause - Any possible where clause e.g: id_ne text_ncontains
 * @param {string} value - the value of the where clause e.g id_ne=value
 */
const convertWhereClause = (whereClause, value) => {
  const separatorIndex = whereClause.lastIndexOf('_')

  // eq operator
  if (separatorIndex === -1) {
    return { field: whereClause, value }
  }

  // split field and operator
  const field = whereClause.substring(0, separatorIndex)
  const operator = whereClause.slice(separatorIndex + 1)

  // the field as underscores
  if (!_.has(VALID_OPERATORS, operator)) {
    return { field: whereClause, value }
  }

  return { field, operator, value }
}

module.exports = convertRestQueryParams
