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
    if (!user.profiles || !user.profiles.length || user.profiles[0].role.name !== 'admin') {
      console.log('Error de autenticación: Usuario no tiene el rol "admin"');
      return res.status(401).send('Usuario no autorizado para realizar esta acción');
    }
    req.user = user; // Agregar el usuario encontrado a la petición
    return next();
  } catch (error) {
    console.log('Error de autenticación: No se pudo obtener el usuario');
    console.log(error.stack);
    return res.status(401).send('Usuario no autorizado para realizar esta acción');
  }
}


async function isAdminOrSameUserOrAnyUser(req, res, next) {
  const userId = req.params.id;
  console.log('ID del usuario:', userId);

  if (!userId) {
    console.log('Error de autenticación: Usuario no autenticado');
    return res.status(401).send('Usuario no autorizado para realizar esta acción');
  }

  try {
    const user = await authService.getAuthenticatedUser(userId);
    console.log('Usuario autenticado:', user);

    const authenticatedUser = await authService.getAuthenticatedUserFromRequest(req);
    console.log('Usuario que hace la petición:', authenticatedUser);

    const isAdmin = authenticatedUser.profiles && authenticatedUser.profiles.some(profile => profile.role.name === 'admin');

    console.log('¿Es administrador?:', isAdmin);

    const isCurrentUser = String(user.id) === String(authenticatedUser.id);
    console.log('¿Es el mismo usuario que hace la petición?:', isCurrentUser);

    let filteredUserInfo = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      image_url: user.image_url
    };

    if (isAdmin || isCurrentUser) {
      filteredUserInfo = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        email_verified: user.email_verified,
        code_phone: user.code_phone,
        phone: user.phone,
        country_id: user.country_id,
        image_url: user.image_url,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    } else {
      filteredUserInfo = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        image_url: user.image_url
      };
    }

    console.log('Información del usuario:', filteredUserInfo);
    res.json(filteredUserInfo);
  } catch (error) {
    console.log('Error de autenticación: No se pudo obtener el usuario');
    console.log(error.stack);
    return res.status(401).send('Usuario no autorizado para realizar esta acción');
  }
}


function isTheSameUser(req, res, next) {
  if (req.user && (req.user.id === req.params.id)) {
    const allowedFields = ['first_name', 'last_name', 'country_id', 'code_phone', 'phone'];
    const fieldsToUpdate = Object.keys(req.body);

    const isValidUpdate = fieldsToUpdate.every(field => allowedFields.includes(field));

    if (!isValidUpdate) {
      console.log('Error de validación: Intento de actualizar un campo no permitido');
      return res.status(400).send('No se permiten actualizar campos adicionales');
    }

    req.user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone
    };

    next();
  } else {
    console.log('Error de autenticación: Usuario no es el mismo usuario');
    res.status(401).send('Usuario no autorizado para realizar esta acción');
  }
}



module.exports = {
  isAdminRole,
  isAdminOrSameUserOrAnyUser,
  isTheSameUser
};
