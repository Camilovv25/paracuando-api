const express = require('express');
const routesUsers = require('./users.router')
const routesAuth = require('./auth.routes')
const passport = require('../libs/passport')

function routerModels(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/auth', routesAuth)
  router.use('/users', routesUsers);


  // Middleware para autenticación
  router.use(passport.authenticate('jwt', { session: false }));


  // Middleware para verificar que el token proporcionado es correcto y que el usuario existe en nuestra DB
  function verifyToken(req, res, next) {
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
      if (err || !user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }
      req.user = user;
      next();
    })(req, res, next);
  }

  // Middleware para verificar si el usuario tiene el rol asignado
  function isAuthorizedForRole(role) {
    return function (req, res, next) {
      if (req.user.role === role) {
        next();
      } else {
        res.status(401).send('Unauthorized');
      }
    };
  }

  // Middleware para verificar si el usuario es propietario del recurso
  function isOwner(resource) {
    return function (req, res, next) {
      if (req.user.id === resource.ownerId) {
        next();
      } else {
        res.status(401).send('Unauthorized');
      }
    };
  }

  // Middleware para verificar si el usuario está al corriente con sus pagos
  function isCurrentOnPayments() {
    return function (req, res, next) {
      if (req.user.isCurrentOnPayments) {
        next();
      } else {
        res.status(401).send('Unauthorized');
      }
    };
  }
}

module.exports = routerModels;
