const R = require('ramda')

const isWithinInterval = require('date-fns/fp/isWithinInterval')

const isEmpty = require('crocks/predicates/isEmpty')
const not = require('crocks/logic/not')
const objOf = require('crocks/helpers/objOf')
const propEq = require('crocks/predicates/propEq')
const when = require('crocks/logic/when')

const { compose } = require('crocks')
const { Either } = require('crocks')
const { Right, Left } = Either

const curry = require('crocks/helpers/curry')
const ifElse = require('crocks/logic/ifElse')
const or = require('crocks/logic/or')

const isKvKModerator = ({ role = {} }) => ['admin', 'kvk-moderator', 'kvk-admin'].includes(role.type)
const isOwner = (entity) => (user) => user._id === entity.created_by._id || entity.isOwner
const isModerator = ({ moderators }) => ({ id, role = {} }) =>
  ['moderator'].includes(role.type) && moderators ? moderators.some((moderator) => moderator.id === id) : false

const NotAllowedError = require('../../../../lib/NotAllowedError')

const checkChallengePermission = curry((user, challenge) => {
  return ifElse(
    or(isKvKModerator, isModerator(challenge)),
    () => Right(challenge),
    () => Left(new NotAllowedError('Not allowed to update this Challenge')),
    user
  )
})

const _isPublish = (params) => ifElse(() => propEq('status', 'published', params), Left, Right)

const _hydrateChallengePatch = (params) => (challenge) => {
  return _isPublish(params)(challenge)
    .bichain((c) => Right(Object.assign(c, params)), allowedToPublish)
    .either(
      () => {
        throw new Error('forbidden')
      },
      (c) => Object.assign(c, params)
    )
}

const _buildErrMessage = (message) => [message]
const _addError = (message) => (b) =>
  R.mergeDeepWith(
    R.concat,
    b,
    compose(
      objOf('error'),
      _buildErrMessage
    )(message)
  )
const propMissing = (prop) =>
  compose(
    isEmpty,
    R.prop(prop)
  )
const _isSelectionEventProvided = (challenge) =>
  challenge.stages ? challenge.stages.filter((stage) => stage.type === 'selection').length === 1 : false
const _buildErr = (pred, mess) => when(pred, _addError(mess))
const _sumErr = (mess, prop) => when(propMissing(prop), _addError(mess, prop))
const _hasErrors = not(propMissing('error'))
const _createDissalowedForPublish = (erroneousChallenge) => {
  throw new Error(erroneousChallenge.error)
}
const _isWithinChallengeTimeline = (challenge) => isWithinInterval(challenge)
const _isSelectionWithinChallenge = ({ start: date }) => _isWithinChallengeTimeline(date)
const _stagesInChallengeTimeline = (challenge) => (challenge.stages ? challenge.stages.every(_isSelectionWithinChallenge) : false)
const allowedToPublish = compose(
  ifElse(_hasErrors, _createDissalowedForPublish, Right),
  _buildErr(not(_isSelectionEventProvided), 'No selection event added to the challenge'),
  _buildErr(not(_stagesInChallengeTimeline), 'There are stages not within the challenge timeline'),
  _sumErr('Missing moderators', 'moderators'),
  _sumErr('Missing property: summary', 'summary'),
  _sumErr('Missing property: short_summary', 'short_summary'),
  _sumErr('Missing property: long_summary', 'long_summary')
)

const processStatus = (params, user) => (challenge) =>
  Right(challenge)
    .chain(checkChallengePermission(user))
    .map(_hydrateChallengePatch(params))

module.exports = {
  checkChallengePermission,
  isKvKModerator,
  isModerator,
  isOwner,
  processStatus
}
