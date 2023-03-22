const router = require('express').Router();
const routesUsers = require('./users.router')
const routesAuth = require('./auth.routes')
const roles = require('./roles.router')
const passport = require('../libs/passport')


function routerModels(app) {
  app.use('/api/v1', router);
  router.use('/auth', routesAuth);

  router.use('/users',passport.authenticate('jwt', { session: false }), routesUsers);

  router.use('/roles', roles);

}

module.exports = routerModels;










