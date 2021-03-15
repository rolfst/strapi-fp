const R = require('ramda')

const either = require('crocks/pointfree/either')
const identity = require('crocks/combinators/identity')
const ifElse = require('crocks/logic/ifElse')
const isEmpty = require('crocks/predicates/isEmpty')

const parseMultiPart = require('strapi-utils/lib/parse-multipart')

const { Either, compose } = require('crocks')

const propMissing = (prop) =>
  compose(
    isEmpty,
    R.prop(prop)
  )
module.exports = async (ctx, next) => {
  ctx.bc_content = either(identity, identity, Either.of(ifElse(propMissing('files'), R.omit(['files']), identity)(parseMultiPart(ctx))))
  await next()
}
