/**
 * Interest.js service
 */

const rtracer = require('cls-rtracer')
const getPathOr = require('crocks/helpers/getPathOr')

const _hasTag = (tags, tag) => tags.filter((item) => item === tag).length > 0
const _removeTagFromArr = (tags, tag) => tags.filter((item) => item != tag)

const _addTagToUser = async (tag, id) => {
  return strapi.plugins['users-permissions'].services.user.fetchUserById({ id }).then((user) => {
    if (!_hasTag(user.tags, tag)) {
      user.tags.push(tag)
      return strapi.plugins['users-permissions'].services.user.update(user)
    }
    return user
  })
}

const _removeTagFromUser = async (tag, id) => {
  return strapi.plugins['users-permissions'].services.user.fetchUserById({ id }).then((user) => {
    if (_hasTag(user.tags, tag)) {
      user.tags = _removeTagFromArr(user.tags, tag)
      return strapi.plugins['users-permissions'].services.user.update(user)
    }
    return user
  })
}

const _patchOperations = {
  add: async (user, body) => {
    const { tag } = body

    return strapi.plugins['tags'].services.tags
      .findOne({ title: tag })
      .then((existingTag) => _addTagToUser(existingTag.title, user.id))
      .catch((e) => {
        throw new Error(`Tag does not exist`)
      })
  },
  remove: async (user, body) => {
    const { tag } = body

    return strapi.plugins['tags'].services.tags
      .findOne({ title: tag })
      .then((existingTag) => _removeTagFromUser(existingTag.title, user.id))
      .catch((e) => {
        throw new Error(`Tag does not exist`)
      })
  }
}

const notImplemented = (operation) => () => {
  throw new Error(`Operation not implemented: ${operation}`)
}

async function patch(body, user) {
  const log = strapi.log.child({ traceId: rtracer.id() })
  log.info(`${body.op}: ${body.tag} (interest)`)

  const fn = getPathOr(notImplemented(body.op), [body.op], _patchOperations)
  return fn(user, body)
}

module.exports = {
  patch
}
