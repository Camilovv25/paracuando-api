const profiles = require('../database/models/profiles');
const roles = require('../database/models/roles');

async function isAdminRole(req, res, next) {
  const userId = req.user && req.user.id; // Obtener el ID del usuario de la petición
  if (!userId) {
    console.log('Error de autenticación: Usuario no autenticado');
    return res.status(401).send('Usuario no autorizado para realizar esta acción');
  }
  console.log('ID de usuario:', userId);

  try {
    // Buscar el usuario en la tabla "profiles" utilizando su "user_id"
    const userProfile = await profiles.findOne({
      where: { user_id: userId },
      attributes: ['role_id'],
    });

    if (!userProfile || !userProfile.role_id) {
      console.log('Error de autenticación: El usuario no tiene un rol asignado');
      return res.status(401).send('Usuario no autorizado para realizar esta acción');
    }

    // Obtener el nombre del rol correspondiente en la tabla "roles"
    const userRole = await roles.findOne({
      where: { id: userProfile.role_id },
      attributes: ['name'],
    });

    if (!userRole || userRole.name !== 'admin') {
      console.log('Error de autenticación: Usuario no es administrador');
      return res.status(401).send('Usuario no autorizado para realizar esta acción');
    }

    return next(); 
  } catch (error) {
    console.log('Error de autenticación: No se pudo obtener el perfil del usuario');
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
