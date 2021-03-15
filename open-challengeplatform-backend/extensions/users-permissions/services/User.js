const { sanitizeEntity } = require('strapi-utils')
const parser = require('xml2json')
const rtracer = require('cls-rtracer')

const { Result } = require('crocks')
const getOr = require('crocks/helpers/getPathOr')
const omit = require('crocks/helpers/omit')
const pick = require('crocks/helpers/pick')
const uploadFiles = require('../../../lib/uploadFiles')

const forwardResult = require('../../../lib/forwardResult')

const { Err } = Result

const _fetchRelatieById = async (kvkmasterid) => {
  return await strapi.plugins['users-permissions'].services.soapbox.opvragenRelatie(kvkmasterid)
}

/**
 * Turn the name data from the CRM XML into a proper fullname
 * @returns { String }
 */
const _parseCrmName = (user) => {
  const prefix = typeof user['rel:voorvoegsel'] === 'string' ? user['rel:voorvoegsel'].replace('?', '').trim() + ' ' : ''

  return `${user['rel:voornamen']} ${prefix}${user['rel:geslachtsnaam']}`.trim()
}

/**
 * @return {Object}
 */
function sanitizeUser(user = {}) {
  return sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model
  })
}

function filterHiddenFields(user = {}) {
  return omit(['kvkmasterid'], user)
}

function applyAuthenticationFilter(targetUser = {}, currentUser = {}) {
  if (!currentUser._id) {
    targetUser.name = targetUser.firstName
    return omit(['firstName', 'profilePicture'], targetUser)
  }

  return targetUser
}

/**
 * Retrieve a user record.
 * @return {Object}
 */
async function fetchUserById(params = {}) {
  const allowedParams = pick(['username', 'kvkmasterid'], params)

  return await strapi
    .query('user', 'users-permissions')
    .findOne(allowedParams)
    .then(sanitizeUser)
}

const _parse = (str) => JSON.parse(parser.toJson(str))
async function getCrmUserData(kvkmasterid) {
  const { XMLError } = strapi.config.functions['bc-errors']

  return _fetchRelatieById(kvkmasterid)
    .then(_parse)
    .then((obj) => {
      const relaties = getOr('', ['s11:Envelope', 's11:Body', 'rop:opvragenRelatieResponse', 'rop:relaties', 'rel:relatie'], obj)

      if (!relaties) {
        throw new Error('relatieGegevens not found')
      }

      return relaties
    })
    .catch((e) => {
      if (typeof e === 'CRMError') throw e
      throw new XMLError(e.message)
    })
}

// Use the parsed XML retrieved from CRM to fill in the provided USER's missing data.
function addParsedRelatieXmlToUser(user, parsedXml) {
  user.firstName = parsedXml['rel:relatieGegevens']['rel:voornamen']
  user.name = _parseCrmName(parsedXml['rel:relatieGegevens'])
  user.username = user.name + user.kvkmasterid.slice(user.kvkmasterid.length - 8)
  user.email = getOr('', ['rel:communicatieGegevens', 'cmn:emailadressen', 'cmn:emailadres'], parsedXml)

  const phoneNumber = getOr('', ['rel:communicatieGegevens', 'cmn:telefoonnummers', 'cmn:telefoonnummer'], parsedXml)

  if (typeof phoneNumber === 'string') {
    if (phoneNumber.length) user.phonenumber = phoneNumber
  }
  return user
}

async function uploadProfilePicture(user, { files, model, source } = {}) {
  let storedUser = strapi.query('user', 'users-permissions').update(user)
  storedUser = uploadFiles(storedUser, files, model, source)

  return storedUser.then(sanitizeUser).catch((err) => {
    throw new Error(`error during uploadProfilePicture`)
  })
}

async function update(user) {
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`updating user`)

  return strapi
    .query('user', 'users-permissions')
    .update(user, user)
    .then(sanitizeUser)
}

async function fetchModerators(params, currentUser) {
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info('finding moderators')

  const { role } = strapi.plugins['users-permissions'].models
  const pipelineArgs = [
    { $match: { type: 'moderator' } },
    {
      $lookup: {
        from: 'users-permissions_user',
        localField: '_id',
        foreignField: 'role',
        as: 'user'
      }
    },
    { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$user', 0] }] } } },
    { $project:
      {
        role: { name: 1, type: 1 },
        name: 1,
        profilePicture: { $cond: [currentUser._id, '$profilePicture', []] } // empty when no userId is present
      }
    }
  ]
  return role
    .aggregate(pipelineArgs)
    .exec()
    .then(forwardResult)
    .catch(Err)
}

module.exports = {
  addParsedRelatieXmlToUser,
  getCrmUserData,
  fetchUserById,
  fetchModerators,
  sanitizeUser,
  applyAuthenticationFilter,
  uploadProfilePicture,
  filterHiddenFields,
  update
}
