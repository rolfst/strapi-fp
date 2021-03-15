const omit = require('crocks/helpers/omit')

async function findChallengeBySlug(slug) {
  const [challengeId] = await strapi
    .query('challenge', 'challenges')
    .model.findOne({ slug }, '_id')
    .distinct('_id')
    .exec()
  return challengeId
}

async function transformChallengeParams(params = {}) {
  if (params.challenge_slug) {
    params.challenge_id = await findChallengeBySlug(params.challenge_slug)
  }
  return Array.isArray(params) ? params : omit(['challenge_slug'], params)
}

module.exports = {
  transformChallengeParams,
  findChallengeBySlug
}
