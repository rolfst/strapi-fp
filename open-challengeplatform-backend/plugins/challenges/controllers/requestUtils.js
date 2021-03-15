const Identity = require('crocks/combinators/identity')
const bimap = require('crocks/pointfree/bimap')

// _handleResult :: (a -> c Result, b -> c Result) -> c Result -> c Result
const _handleResult = (good, bad) => bimap(bad, good)

const defaultResponseSetup = (ctx, customSendFn) => {
  const defaultSend = (ctx) => (x) => ctx.send(x)
  const send = customSendFn || defaultSend
  const sendBad = (ctx) => (err) => ctx.badRequest(err.message)
  const sendBadRequest = forward(sendBad(ctx))
  const sendGoodRequest = forward(send(ctx))
  const resolveResult = _handleResult(sendGoodRequest, sendBadRequest)
  const sendInternalErrorResponse = sendInternalError(ctx)

  return {
    sendInternalErrorResponse,
    resolveResult
  }
}

const forward = (fn) => (x) => {
  return fn(Identity(x))
}

const sendBadRequest = (ctx) => (x) => ctx.badRequest(x.message)
const sendInternalError = (ctx) => (x) => {
  ctx.log.error(x)
  return ctx.badImplementation(x)
}

module.exports = {
  forward,
  sendBadRequest,
  sendInternalError,
  defaultResponseSetup
}
