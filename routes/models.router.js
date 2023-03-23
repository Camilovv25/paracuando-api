
const router = require('express').Router();
const routesUsers = require('./users.router');
const routesAuth = require('./auth.routes');
const roles = require('./roles.router');
const passport = require('../libs/passport');
const routesPublicationsTypes = require('./publicationsTypes.routes');
const routesCountries = require ( './countries.routes');
const routesTags = require('./tags.routes');
const routesStates = require('./states.routes');

// const isAuthenticatedByPassportJwt = require('../libs/passport')

function routerModels(app) {
  //const express = require('express');
  app.use('/api/v1', router);
  router.use('/auth', routesAuth);
  router.use('/publications-types', routesPublicationsTypes);
  router.use('/countries', routesCountries);
  router.use('/tags', routesTags);
  router.use('/states', routesStates);

  router.use('/users',passport.authenticate('jwt', { session: false }), routesUsers);

  router.use('/roles', roles);

}
module.exports = routerModels;










