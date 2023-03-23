const { Op } = require('sequelize');
const users = require('../database/models/users');
const profiles = require('../database/models/profiles');
const roles = require('../database/models/roles');

const AuthService = require('../services/auth.service');

const authService = new AuthService();


async function isAdminRole(req, res, next) {
  const userId = req.user && req.user.id; // Obtener el ID del usuario de la petición
  if (!userId) {
    console.log('Error de autenticación: Usuario no autenticado');
    return res.status(401).send('Usuario no autorizado para realizar esta acción');
  }

  try {
    const user = await authService.getAuthenticatedUser(userId);
    req.user = user; // Agregar el usuario encontrado a la petición
    return next();
  } catch (error) {
    console.log('Error de autenticación: No se pudo obtener el usuario');
    console.log(error.stack);
    return res.status(401).send('Usuario no autorizado para realizar esta acción');
  }
}


function isTheSameUser(req, res, next) {
  if (req.user && (req.user.id === req.params.id || req.user.role === 'admin')) {
    // El usuario solo puede ver los campos necesarios en la vista pública
    if (req.user.id !== req.params.id) {
      req.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        image_url: req.user.image_url
      };
    }
    next();
  } else {
    console.log('Error de autenticación: Usuario no es el mismo usuario o administrador');
    res.status(401).send('Usuario no autorizado para realizar esta acción');
  }
}

function isAdminOrSameUser(req, res, next) {
  if (req.user && (req.user.role === 'admin' || req.user.id === req.params.id)) {
    next();
  } else {
    console.log('Error de autenticación: Usuario no es el mismo usuario o administrador');
    res.status(401).send('Usuario no autorizado para realizar esta acción');
  }
}

function isAnyRoleByList(roles) {
  return function (req, res, next) {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      console.log('Error de autenticación: Usuario no tiene los permisos necesarios');
      res.status(401).send('Usuario no autorizado para realizar esta acción');
    }
  };
}

function isUserLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log('Error de autenticación: Usuario no ha iniciado sesión');
    res.status(401).send('Usuario no autorizado para realizar esta acción');
  }
}


module.exports = {
  isAdminRole,
  isTheSameUser,
  isAdminOrSameUser,
  isAnyRoleByList,
  isUserLoggedIn
};
