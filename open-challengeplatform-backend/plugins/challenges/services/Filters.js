const rtracer = require('cls-rtracer')

const { Either } = require('crocks')
const either = require('crocks/pointfree/either')
const { Result } = require('crocks')
const { Left, Right } = Either
const { Ok, Err } = Result

/**
 * add
 *
 * @param {Object} body content for Challenge
 * @param {Object} upload
 * @param {File| array<files>} upload.file or files to be saved
 * @param {string} upload.model model that files should refer to
 * @param {string} upload.source plugin where model refers to
 * @returns {Promise<Result<Challenge|Error>>} Challenge that is persisted
 */
async function add(params, body, user) {
  const log = strapi.log.child({ traceId: rtracer.id() })

  let storedFilter = strapi.query('filter', 'challenges').create(body)

  return storedFilter.then(Ok).catch((e) => {
    log.warn(`Error creating filter: ${e}`)
    return Err(e)
  })
}

const _roleFilter = (user) => (user ? Right(user.role.type) : Left('public'))
const _buildFilter = (str) => ({ roles: { $in: [str] } })

/**
 * @description: fetches filters
 * @param {Object} body content for Challenge
 * @param {Object} upload
 * @param {File| array<files>} upload.file or files to be saved
 * @param {string} upload.model model that files should refer to
 * @param {string} upload.source plugin where model refers to
 * @return {Promise<Result>} Result
 */
async function fetchAll(params, query = {}, user) {
  const log = strapi.log.child({ traceId: rtracer.id() })

  log.info('finding menufilters', params, query)
  let filters = either(_buildFilter, _buildFilter, _roleFilter(user))

  return (
    strapi
      .query('filter', 'challenges')
      .model.aggregate([
        {
          $match: filters
        },
        {
          $project: { filter: '$filter', _id: '$method' }
        },
        {
          $group: {
            _id: { method: '$_id' },
            item: { $push: '$filter' }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $arrayToObject: {
                $let: {
                  vars: {
                    data: [{ k: { $toString: '$_id.method' }, v: '$item' }]
                  },
                  in: '$$data'
                }
              }
            }
          }
        }
      ])
      // .then(_filterIds)
      .then(Ok)
      .catch((e) => {
        log.warn(`Error in fetching ${e}`)
        return Err(e)
      })
  )
}
/**
 * Filters.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */
module.exports = {
  add,
  fetchAll
}
