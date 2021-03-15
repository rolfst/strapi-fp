const R = require('ramda')
const { Maybe } = require('crocks')
const { State } = require('crocks')

const { Just } = Maybe
const { get, modify } = State

const alt = require('crocks/pointfree/alt')
const and = require('crocks/logic/and')
const assign = require('crocks/helpers/assign')
const compose = require('crocks/helpers/compose')
const concat = require('crocks/pointfree/concat')
const curry = require('crocks/helpers/curry')
const getPropOr = require('crocks/helpers/getPropOr')
const identity = require('crocks/combinators/identity')
const isEmpty = require('crocks/predicates/isEmpty')
const isSameType = require('crocks/predicates/isSameType')
const isTruthy = require('crocks/predicates/isTruthy')
const map = require('crocks/pointfree/map')
const not = require('crocks/logic/not')
const option = require('crocks/pointfree/option')
const propEq = require('crocks/predicates/propEq')
const pathSatisfies = require('crocks/predicates/pathSatisfies')
const safe = require('crocks/Maybe/safe')

const isWithinInterval = require('date-fns/fp/isWithinInterval')
// isWithinRange :: Interval a, Date d => a -> d -> boolean
const isWithinRange = (a) => isWithinInterval(a)
const allConfirm = (pred) => (xs) => xs.every(pred)
const hasModerators = (challenge) => isTruthy(getPropOr(false, 'moderators', challenge).length)

const isNotEmptyChallenge = and(
  not(
    compose(
      isEmpty,
      R.prop('summary')
    )
  ),
  and(
    not(
      compose(
        isEmpty,
        R.prop('short_summary')
      )
    ),
    not(
      compose(
        isEmpty,
        R.prop('long_summary')
      )
    )
  )
)
const ADDITIONAL_PROJECT_KEYS = {
  createdAt: 1,
  updatedAt: 1,
  challenge_slug: '$challenge.slug',
  favorites: 1,
  likes: 1,
  child_count: 1,
  favoritedByUser: { $toBool: { $size: '$favoritedByUser' } },
  likedByUser: { $toBool: { $size: '$likedByUser' } }
}
/* basic */
const matchLens = R.lensPath([0, '$match', '$and'])
/** addMatcher : SemiGroupoid a -> MatchTarget -> MatchTarget */
const addMatcher = (setter, lens = matchLens) => R.over(lens, setter)
const _arrOnCondition = (fn) =>
  compose(
    alt(Maybe.of([])),
    map(Array.of),
    fn
  )
const _avail = not(isEmpty)
// _ruleComposer :: (a -> Maybe a b) -> (a -> boolean) -> Maybe a b
const _ruleComposer = (morph, evaluator) =>
  compose(
    option(Maybe.of([])),
    map(morph),
    evaluator,
    (x) => (isSameType(Maybe, x) ? x.option([]) : x)
  )

/* sorting */
const _randomSortRule = () => Just({ $sample: { size: 10 } })
const _sorting = (q) => {
  const m = _ruleComposer(_arrOnCondition(_randomSortRule), hasRandomSorting)(q)
  return m
}

/* logged in */
const interestRule = ({ interests }) => Just([{ tags: { $in: interests } }])
const _availableInterests = _ruleComposer(interestRule, satisfiesProperty(['interests']))
const addInterestsMatch = (q, u) => {
  const us = _ruleComposer(() => Just(u), hasRandomSorting)
  const a = _availableInterests(us(q)).alt(Maybe.of([]))
  const m = option(identity, a)
  return addMatcher(R.concat(m))
}

/* basic */
const favoriteMatchForChallenge = (challengeIds) => [{ $expr: { $in: ['$slug', challengeIds] } }]

const challengeLookup = (user = {}) => [
  {
    $lookup: {
      from: 'upload_file',
      let: { related: '$_id' },
      pipeline: [
        { $match: { $expr: { $and: [{ $in: ['$$related', '$related.ref'] }, { $in: ['hero', '$related.field'] }] } } },
        { $project: { related: 0 } }
      ],
      as: 'hero'
    }
  },
  {
    $lookup: {
      from: 'upload_file',
      let: { related: '$_id' },
      pipeline: [
        { $match: { $expr: { $and: [{ $in: ['$$related', '$related.ref'] }, { $in: ['attachments', '$related.field'] }] } } },
        { $project: { related: 0 } }
      ],
      as: 'attachments'
    }
  },
  {
    $lookup: {
      from: 'reactions',
      let: { fullS: '$highlights.full_slug' },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ['$full_slug', '$$fullS']
            }
          }
        },
        {
          $lookup: {
            from: 'users-permissions_user',
            let: { user: '$created_by' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$user']
                  }
                }
              },
              {
                $project: { email: 1, username: 1, _id: 0 }
              }
            ],
            as: 'created_by'
          }
        },
        {
          $unwind: {
            path: '$created_by',
            preserveNullAndEmptyArrays: true
          }
        }
      ],
      as: 'highlights'
    }
  },
  {
    $lookup: {
      from: 'component_stage_stages',
      let: { stageId: '$stages.ref' },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ['$_id', '$$stageId']
            }
          }
        },
        { $sort: { start: 1 } }
      ],
      as: 'stages'
    }
  },
  {
    $lookup: {
      from: 'component_company_companies',
      let: { companyId: '$company.ref' },
      pipeline: [
        { $match: { $expr: { $in: ['$_id', '$$companyId'] } } },
        {
          $lookup: {
            from: 'upload_file',
            pipeline: [{ $match: { $expr: { $eq: ['$related.ref', '$$companyId'] } } }, { $project: { related: 0 } }],
            as: 'logo'
          }
        },
        { $unwind: { path: '$logo', preserveNullAndEmptyArrays: true } }
      ],
      as: 'company'
    }
  },
  {
    $lookup: {
      from: 'users-permissions_user',
      let: { userId: '$updatedBy' },
      pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$userId'] } } }, { $project: { username: 1, email: 1 } }],
      as: 'updatedBy'
    }
  },
  {
    $lookup: {
      from: 'users-permissions_user',
      let: { nId: '$nominees' },
      pipeline: [
        { $match: { $expr: { $in: ['$_id', '$$nId'] } } },
        { $project: { role: 0, password: 0, confirmed: 0, blocked: 0, kvkmasterid: 0, name: 0, provider: 0, tags: 0 } }
      ],
      as: 'nominees'
    }
  },
  {
    $lookup: {
      from: 'user-permissions_user',
      let: { sId: '$selected' },
      pipeline: [
        { $match: { $expr: { $in: ['$_id', '$$sId'] } } },
        { $project: { role: 0, password: 0, confirmed: 0, blocked: 0, kvkmasterid: 0, name: 0, provider: 0, tags: 0 } }
      ],
      as: 'selected'
    }
  },
  {
    $lookup: {
      from: 'users-permissions_user',
      let: { mId: '$moderators' },
      pipeline: [
        { $match: { $expr: { $in: ['$_id', '$$mId'] } } },
        {
          $lookup: {
            from: 'users-permissions_role',
            localField: 'role',
            foreignField: '_id',
            as: 'role'
          }
        },
        { $unwind: { path: '$role', preserveNullAndEmptyArrays: true } },
        { $project: { password: 0, confirmed: 0, blocked: 0, kvkmasterid: 0, name: 0, provider: 0, tags: 0 } }
      ],
      as: 'moderators'
    }
  },
  {
    $lookup: {
      from: 'reactions',
      let: { rparent: '$_id' },
      pipeline: [
        {
          $match: { $expr: { $eq: ['$challenge_id', '$$rparent'] } }
        },
        { $count: 'count' }
      ],
      as: 'child_count'
    }
  },
  {
    $lookup: {
      from: 'like_like',
      let: { rtarget: '$slug' },
      pipeline: [
        {
          $match: { $expr: { $eq: ['$target', '$$rtarget'] } }
        },
        { $count: 'count' }
      ],
      as: 'likes'
    }
  },
  {
    $lookup: {
      from: 'favorite_favorite',
      let: { rtarget: '$slug' },
      pipeline: [
        {
          $match: { $expr: { $eq: ['$target', '$$rtarget'] } }
        },
        { $count: 'count' }
      ],
      as: 'favorites'
    }
  },
  {
    $lookup: {
      from: 'favorite_favorite',
      let: { rtarget: '$slug' },
      pipeline: [
        {
          $match: {
            $and: [{ $expr: { $eq: ['$target', '$$rtarget'] } }, { $expr: { $eq: ['$owner_id', user._id] } }]
          }
        },
        { $count: 'count' }
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
            $and: [{ $expr: { $eq: ['$target', '$$rtarget'] } }, { $expr: { $eq: ['$owner_id', user._id] } }]
          }
        },
        { $count: 'count' }
      ],
      as: 'likedByUser'
    }
  },
  { $unwind: { path: '$hero', preserveNullAndEmptyArrays: true } },
  { $unwind: { path: '$company', preserveNullAndEmptyArrays: true } },
  { $unwind: { path: '$nominees', preserveNullAndEmptyArrays: true } },
  { $unwind: { path: '$updatedBy', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      child_count: { $sum: '$child_count.count' },
      likes: { $sum: '$likes.count' },
      favorites: { $sum: '$favorites.count' }
    }
  }
]

const challengePipeline = (user) => [{ $match: { $and: [] } }].concat(challengeLookup(user))

/* statuses */
// status = archived
const archivedMatch = [{ status: { $eq: 'archived' } }]
//current
const currentMatch = [{ start_date: { $lte: null } }, { end_date: { $gte: null } }, { status: { $eq: 'published' } }]

// status = published, endDate lte now
const closedMatch = [{ start_date: { $lte: null } }, { end_date: { $lte: null } }, { status: { $eq: 'published' } }]

// status = unpublished
const unpublishedMatch = [{ status: { $eq: 'unpublished' } }]

// status = published, startDate gte now
const upcomingMatch = [{ start_date: { $gte: null } }, { end_date: { $gte: null } }, { status: { $eq: 'published' } }]
const startDateLens = R.lensPath([0, 'start_date'])
const endDateLens = R.lensPath([1, 'end_date'])

const pointCut = curry((key, value) => assign({ [key]: value }))
const gte = pointCut('$gte')
const lte = pointCut('$lte')

const modifyBeforeStartDateMatcher = (date) => addMatcher(gte(date), startDateLens)
const modifyAfterStartDateMatcher = (date) => addMatcher(lte(date), startDateLens)
const modifyBeforeEndDateMatcher = (date) => addMatcher(gte(date), endDateLens)
const modifyAfterEndDateMatcher = (date) => addMatcher(lte(date), endDateLens)
const modifyAfterStartDate = (date) => () => modify(modifyAfterStartDateMatcher(date))
const modifyAfterEndDate = (date) => () => modify(modifyAfterEndDateMatcher(date))
const modifyBeforeEndDate = (date) => () => modify(modifyBeforeEndDateMatcher(date))
const modifyBeforeStartDate = (date) => () => modify(modifyBeforeStartDateMatcher(date))

const myMatch = [
  {
    $or: [{ moderators: { $in: [] } }, { created_by: null }]
  }
]

const moderatorsLens = R.lensPath([0, '$or', 0, 'moderators'])
const ownerLens = R.lensPath([0, '$or', 1])
const my = (userId) =>
  get()
    .chain(() => modify(addMatcher(assign({ $in: [userId] }), moderatorsLens)))
    .chain(() => modify(addMatcher(assign({ created_by: userId }), ownerLens)))
    .execWith(myMatch)

const addMyMatch = (userId) => addMatcher(R.concat(my(userId)))

const favorites = [
  { $match: { owner_id: null } },
  {
    $lookup: {
      from: 'challenges',
      let: { challenge_id: '$target' },
      pipeline: null,
      as: 'challenges'
    }
  },
  {
    $unwind: '$challenges'
  },
  {
    $replaceRoot: { newRoot: '$challenges' }
  }
]

const addFindOneChallengeMatcher = (slug) => addMatcher(R.concat([{ slug: { $eq: slug } }]))
const addSelectOneMatcher = [{ $unwind: { path: '$_id', preserveNullAndEmptyArrays: true } }]

/** addFavoriteMatch : [string] -> [MatchRules] -> MatchTarget  */
const addFavoriteMatch = (challengeIds) => addMatcher(R.concat(favoriteMatchForChallenge(challengeIds)))

/* status matchers */
const addArchivedMatch = addMatcher(R.concat(archivedMatch))
const cl = (date) =>
  get()
    .chain(modifyAfterEndDate(date))
    .chain(modifyAfterStartDate(date))
    .execWith(closedMatch)
const addClosedMatch = (date) => addMatcher(R.concat(cl(date)))
const c = (date) => {
  const r = get()
    .chain(modifyBeforeEndDate(date))
    .chain(modifyAfterStartDate(date))
    .execWith(currentMatch)
  return r
}

const addCurrentMatch = (date) => addMatcher(concat(c(date)))
const addAllMatch = addMatcher(concat([{ $expr: { $gte: ['$__v', 0] } }]))

/** addUnpublishedMatch : [MatchRules] -> MatchTarget  */
const addUnpublishedMatch = addMatcher(concat(unpublishedMatch))

const u = (date) =>
  get()
    .chain(modifyBeforeEndDate(date))
    .chain(modifyBeforeStartDate(date))
    .execWith(upcomingMatch)
const addUpcomingMatch = (date) => addMatcher(concat(u(date)))

const challengeLens = R.lensPath([1, '$lookup', 'pipeline'])
const addChallengeMatcher = (pipeline) => addMatcher(R.concat(pipeline), challengeLens)
const addProjectionMatcher = (props) => (state) => {
  const r = R.concat(state, [{ $project: Object.assign({}, props, ADDITIONAL_PROJECT_KEYS) }])
  return r
}
function addProjection(props) {
  return modify(addProjectionMatcher(props))
}

// public functions

function addAll() {
  return modify(addAllMatch)
}
function addArchived() {
  return modify(addArchivedMatch)
}
function addChallenge(pipeline) {
  return () => modify(addChallengeMatcher(pipeline))
}
function addClosed(date) {
  return modify(addClosedMatch(date))
}
function addCurrent(date) {
  return modify(addCurrentMatch(date))
}
function addFavorite(challengeIds) {
  return modify(addFavoriteMatch(challengeIds))
}
function addInterrests(query, user) {
  return modify(addInterestsMatch(query, user))
}
function addMy(userId) {
  return modify(addMyMatch(userId))
}
function addUnpublished() {
  return modify(addUnpublishedMatch)
}
function addUpcoming(date) {
  return modify(addUpcomingMatch(date))
}
function buildRandomSorting(query) {
  return _sorting(query)
}
function hasRandomSorting(x) {
  return safe(propEq('sort', 'random'))(x)
}
function satisfiesProperty(path) {
  return safe(pathSatisfies(path, _avail))
}
function addFindOneChallenge(slug) {
  return modify(addFindOneChallengeMatcher(slug))
}
function addSelectOne() {
  return addSelectOneMatcher
}
module.exports = {
  addAll,
  addArchived,
  addChallenge,
  addClosed,
  addCurrent,
  addFavorite,
  addFindOneChallenge,
  addInterrests,
  addMy,
  addProjection,
  addSelectOne,
  addUnpublished,
  addUpcoming,
  allConfirm,
  challengeLookup,
  challengePipeline,
  favorites,
  buildRandomSorting,
  hasModerators,
  isNotEmptyChallenge,
  isWithinRange,
  satisfiesProperty
}
