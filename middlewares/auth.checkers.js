const passport = require('../libs/passport')

function isAdminRole(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user || user.role !== 'admin') {
      console.log('Error de autenticación: Usuario no es administrador');
      res.status(401).send('Usuario no autorizado para realizar esta acción');
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
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
