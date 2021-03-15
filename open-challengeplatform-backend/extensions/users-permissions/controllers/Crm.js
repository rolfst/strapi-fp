'use strict'

/**
 * Crm.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */


/**
* /crm/connect route
* @return { Object } *
*/
async function connect(ctx) {
    return strapi.plugins['users-permissions'].services.crm
      .connect(ctx)
      .then((user) => ctx.send(user))
      .catch((err) => ctx.badRequest(err))
}

module.exports = {
    connect
}
