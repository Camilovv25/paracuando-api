const express = require('express');

const routesAuth = require('./auth.routes')
const routesPublicationsTypes = require('./publicationsTypes.routes');
const routesCountries = require ( './countries.routes');
// const routesUsers = require('./users.routes')

// const isAuthenticatedByPassportJwt = require('../libs/passport')

function routerModels(app) {
  const router = express.Router();

  app.use('/api/v1', router);
  router.use('/auth', routesAuth);
  router.use('/publications-types', routesPublicationsTypes);
  router.use('/countries', routesCountries)
}

module.exports = routerModels
