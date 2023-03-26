const router = require('express').Router();
const routesUsers = require('./users.router');
const routesAuth = require('./auth.routes');
const roles = require('./roles.router');
const routesPublicationsTypes = require('./publicationsTypes.router');
const routesCountries = require ( './countries.router');
const routesTags = require('./tags.router');
const routesStates = require('./states.router');
const routesCities = require('./cities.router');
const routesPublications = require('./publications.router');
const passport = require('../libs/passport');


const auth = passport.authenticate('jwt', { session: false })

function routerModels(app) {

  app.use('/api/v1', router);
  router.use('/auth', routesAuth);
  router.use('/users', auth, routesUsers);
  router.use('/publications', routesPublications);
  router.use('/publications-types', auth, routesPublicationsTypes);
  router.use('/countries', auth, routesCountries);
  router.use('/tags', auth, routesTags);
  router.use('/states', auth, routesStates);
  router.use('/cities', routesCities);
  router.use('/roles', auth, roles);
}
module.exports = routerModels;

