/**
 * Interest.js controller
 *
 * @description: A set of functions for handling an USER object's INTERESTS (Relation => User <has many> Tags)
 */

async function patch(ctx) {
  const { body } = ctx.request
  const user = ctx.user

  return strapi.plugins['users-permissions'].services.interest.patch(body, user)
}

module.exports = {
  patch
}
