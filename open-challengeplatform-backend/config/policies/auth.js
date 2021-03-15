const R = require('ramda')

const getPathOr = require('crocks/helpers/getPathOr')
const ifElse = require('crocks/logic/ifElse')
const { Maybe } = require('crocks')

const { Just, Nothing } = Maybe

const _getCurrentRoute = (ctx) => getPathOr({}, ['request', 'route'], ctx)
const _getRouteConfigs = (plugins, plugin) => R.path(['config', 'routes'], plugins[plugin])
const _isAvailable = (path) => (obj) => !R.isNil(R.path(path, obj))
const _safe = (pred) => ifElse(pred, Just, Nothing)

// _isConfigRoute : ActiveRoute -> ConfigRoute -> boolean
const _isConfigRoute = (cRoute) => (roleRoute) =>
  roleRoute.method.toLowerCase() === cRoute.verb.toLowerCase() && roleRoute.path === cRoute.splittedEndpoint

module.exports = async (ctx, next) => {
  const user = ctx.user
  if (user.role.type === 'admin') return next()

  const currentRoute = _getCurrentRoute(ctx)
  const configRoutes = _getRouteConfigs(strapi.plugins, currentRoute.plugin)
  const currentConfigRoute = _isConfigRoute(currentRoute)

  const foundRoute = R.find(currentConfigRoute, configRoutes)

  const allowedRoles = _safe(_isAvailable(['config', 'roles']))(foundRoute)
  const containsRole = (role) => (config) => {
    const roles = _safe(_isAvailable(['roles']))(config)
    return roles.chain((c) => ifElse((config) => config.roles.includes(role.type), Just, Nothing, c)).option(false)
  }

  const isAllowedForUser = (user) => (route = {}) => {
    const userContainsRole = containsRole(user.role)
    return ifElse(userContainsRole, () => Just(true), Nothing, route.config)
  }
  const flow = allowedRoles.chain(isAllowedForUser(user)).option(false)

  if (flow) return next()
  return ctx.unauthorized('Not allowed')
}
