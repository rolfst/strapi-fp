const R = require('ramda')
const { getModelAttributes, toProjectionSettings } = require('../../../../../lib/projectKeyUtils')
const { transformChallengeParams } = require('../../../utils/challengeUtils')
const convertRestQueryParamsForAggregate = require('../../../../../config/functions/convertRestQueryParamsForAggregate')

// Array a -> a | [a]
const _parseSingleResult = (result = []) => (!result.length ? {} : result.length == 1 ? result[0] : result)
const _transformKey = (key) => (key == 'target' ? 'slug' : key)

const additionalProjectKeys = {
  createdAt: 1,
  updatedAt: 1,
  challenge_slug: '$challenge.slug',
  favorites: { $size: '$favorites' },
  likes: { $size: '$likes' },
  child_count: { $size: '$child_count' },
  favoritedByUser: { $toBool: { $size: '$favoritedByUser' } },
  likedByUser: { $toBool: { $size: '$likedByUser' } },
  isOwner: 1,
  isHighlighted: { $toBool: { $size: '$isHighlighted' } },
  summary: { $cond: [{ $eq: ['$status', 'removed'] }, '$redaction', '$summary'] }
}

/**
 * @description transforms parts of the (ctx)query into "$match:"" arguments.
 * @param {String} query.depth
 * @param {String} query.full_slug_contains
 */
const _addQueryToMatchArray = (matchArray = [], query) => {
  if (query.depth) matchArray.push({ $expr: { $eq: [`$depth`, parseInt(query.depth)] } })
  if (query.full_slug_contains) {
    const pattern = new RegExp(query.full_slug_contains)
    matchArray.push({ full_slug: pattern })
  }
  return matchArray
}

/**
 *
 * @param {*} params
 * @returns { Array[] }
 */
const _paramsToExpressions = (params) => Object.entries(params).map(([key, value]) => ({ $expr: { $eq: [`$${_transformKey(key)}`, value] } }))

const _paramsToMatchArgs = async (params = {}, query) => {
  const parsedParams = await transformChallengeParams(params)

  if (Array.isArray(parsedParams) && parsedParams.length) {
    let parsedArray = parsedParams.map((param) => _paramsToExpressions(param)[0])
    return { $and: [{ $or: parsedArray }] }
  }

  let andMatchArray = _paramsToExpressions(parsedParams)

  andMatchArray = query ? _addQueryToMatchArray(andMatchArray, query) : andMatchArray
  return andMatchArray.length ? { $and: andMatchArray } : {}
}

/**
 *  @name getReactions
 *  @param {Object} user
 *  @param {Object} params
 *  @return {Promise<Array<Reaction>>}
 */
async function getReactions({ params = {}, query = {}, user = {} }) {
  const attributes = await getModelAttributes('reaction').catch(() => {
    throw new Error('cannot get reaction attributes')
  })
  const keys = toProjectionSettings(attributes)
  const projectKeys = Object.assign({}, keys, additionalProjectKeys)
  const matchArgs = await _paramsToMatchArgs(params, query)
  const userId = user._id ? user._id : null

  const filters = convertRestQueryParamsForAggregate(query)
  const queryParameters = [{ $match: matchArgs }].concat(filters)

  // reaction query order:
  // sort -> skip -> limit -> match (Arrange A-Z, Start from A, stop at B)
  return strapi.query('reaction', 'challenges').model.aggregate(
    queryParameters.concat([
      {
        $lookup: {
          from: 'challenges',
          let: { rtarget: '$challenge_id' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$_id', '$$rtarget'] } }
            },
            {
              $project: { _id: 0, slug: 1 }
            }
          ],
          as: 'challenge'
        }
      },
      {
        $unwind: {
          path: '$challenge',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'challenges',
          let: { reactionSlug: '$full_slug' },
          pipeline: [
            {
              $match: { $expr: { $in: ['$$reactionSlug', '$highlights.full_slug'] } }
            },
            {
              $project: { _id: 0, slug: 1 }
            }
          ],
          as: 'isHighlighted'
        }
      },
      {
        $lookup: {
          from: 'favorite_favorite',
          let: { rtarget: '$slug' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$target', '$$rtarget'] } }
            }
          ],
          as: 'favorites'
        }
      },
      {
        $lookup: {
          from: 'like_like',
          let: { rtarget: '$slug' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$target', '$$rtarget'] } }
            }
          ],
          as: 'likes'
        }
      },
      {
        $lookup: {
          from: 'reactions',
          let: { rparent: '$_id' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$parent_id', '$$rparent'] } }
            }
          ],
          as: 'child_count'
        }
      },
      {
        $lookup: {
          from: 'users-permissions_user',
          let: { rtarget: '$created_by' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$_id', '$$rtarget'] } }
            },
            {
              $lookup: {
                from: 'users-permissions_role',
                localField: 'role',
                foreignField: '_id',
                as: 'role'
              }
            },
            {
              $lookup: {
                from: 'upload_file',
                let: { ref: '$_id' },
                pipeline: [
                  {
                    $match: { $expr: { $in: ['$$ref', '$related.ref'] } }
                  }
                ],
                as: 'profilePicture'
              }
            },
            {
              $project: {
                role: { name: 1, type: 1 },
                name: { $cond: [userId, '$name', '$firstName'] }, // replace name with firstName on no Auth
                profilePicture: { $cond: [userId, '$profilePicture', []] } // empty when no userId is present
              }
            },
            {
              $unwind: {
                path: '$profilePicture',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $unwind: {
                path: '$role',
                preserveNullAndEmptyArrays: true
              }
            }
          ],
          as: 'created_by'
        }
      },
      {
        $unwind: '$created_by'
      },
      {
        $addFields: {
          isOwner: { $eq: ['$created_by._id', userId] }
        }
      },
      {
        $lookup: {
          from: 'favorite_favorite',
          let: { rtarget: '$slug' },
          pipeline: [
            {
              $match: {
                $and: [{ $expr: { $eq: ['$target', '$$rtarget'] } }, { $expr: { $eq: ['$owner_id', userId] } }]
              }
            }
          ],
          as: 'favoritedByUser'
        }
      },
      {
        $lookup: {
          from: 'like_like',
          let: { rtarget: '$slug' },
          pipeline: [
            {
              $match: {
                $and: [{ $expr: { $eq: ['$target', '$$rtarget'] } }, { $expr: { $eq: ['$owner_id', userId] } }]
              }
            }
          ],
          as: 'likedByUser'
        }
      },
      {
        $project: projectKeys
      }
    ])
  )
}

/**
 *  @name getOneReaction
 *  @param {Object} user
 *  @param {Object} params
 *  @return {Promise<Reaction>}
 */
async function getOneReaction({ params = {}, user = {} }) {
  return getReactions({ params, user }).then(_parseSingleResult)
}

/**
 * @name getParticipants
 * @param {*} slug
 * @param {*} user
 * @return {Array<User>}
 */
async function getParticipants(params, user = {}) {
  const transformedParams = await transformChallengeParams(params)
  const query = { _limit: 100 }
  const { challenge_id } = transformedParams

  if (!challenge_id) throw new Error('please provide a valid challenge slug')

  const reactions = await getReactions({ params: { challenge_id }, query, user })
  return R.uniq(reactions.map((reaction) => reaction.created_by))
}

module.exports = {
  getOneReaction,
  getReactions,
  getParticipants
}
