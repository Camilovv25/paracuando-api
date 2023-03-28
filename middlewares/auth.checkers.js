const AuthService = require('../services/auth.service');
const models = require('../database/models')
const authService = new AuthService();


async function isAdminRole(req, res, next) {
  const userId = req.user.id; // Obtener el ID del usuario de la petición
  console.log(userId,'here')
 

  try {
    const user = await authService.getAuthenticatedUser(userId);
    if (!user.profiles || !user.profiles.length || user.profiles[0].role.name !== 'admin') {
      return res.status(401).json({
        error: {
          status: 401,
          message: 'User is not authorized to perform this action',
          details: 'User does not have admin role' //Error while checking user roles
        }
      });
    }
    req.user = user; // Agregar el usuario encontrado a la petición
    return next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: 'User is not authorized to perform this action'
      }
    });
  }
}


async function isAdminOrSameUserOrAnyUser(req, res, next) {
  const userId = req.params.id;

  try {
    const user = await authService.getAuthenticatedUser(userId);

    const authenticatedUser = await authService.getAuthenticatedUserFromRequest(req);

    const isAdmin = authenticatedUser.profiles && authenticatedUser.profiles.some(profile => profile.role.name === 'admin');

    const isCurrentUser = String(user.id) === String(authenticatedUser.id);


    let filteredUserInfo = {
      first_name: user.first_name,
      last_name: user.last_name,
      image_url: user.image_url,
      interest: user.interest
    };

    if (isAdmin || isCurrentUser) {
      // user.setInterest()
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
        updated_at: user.updated_at,
        interest: user.interest
      };
    } else {
      filteredUserInfo = {
        first_name: user.first_name,
        last_name: user.last_name,
        image_url: user.image_url
      };
    }

    return res.json(filteredUserInfo);
  } catch (error) {
    return res.status(401).json({
      error: {
        status: 401,
        message: 'User is not authorized to perform this action',
      }
    });
  }
}


function isTheSameUser(req, res, next) {
  if (req.user && (req.user.id === req.params.id)) {
    next();
  } else {
    res.status(401).json({
      error: {
        status: 401,
        message: 'Unauthorized',
        details: 'User is not the same user'
      }
    });
  }
}



function isTheSameUserUpdated(req, res, next) {
  if (req.user && (req.user.id === req.params.id)) {

    const allowedFields = [
      'first_name',
      'last_name',
      'country_id',
      'code_phone',
      'phone',
      'tags'
    ];
    const fieldsToUpdate = Object.keys(req.body);

    const isValidUpdate = fieldsToUpdate.every(field => allowedFields.includes(field));

    if (!isValidUpdate) {

      return res.status(400).json({
        error: {
          status: 400,
          message: 'Update failed',
          details: 'Only certain fields are allowed to be updated',
          fields: {
            first_nam: 'String',
            last_name: 'String',
            country_id: '1',
            code_phone: '+57',
            phone: '3104589634',
            tags: '1,2,3'
          }
        }
      });
    }

    req.user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      country_id: req.body.country_id,
      code_phone: req.body.code_phone,
      phone: req.body.phone
    };

    next();
  } else {

    res.status(401).json({
      error: {
        status: 401,
        message: 'User is not authorized to perform this action',
        details: 'User is not the same user'
      }
    });
  }
}




//update only admin role
async function isAdminUpdate(req, res, next) {
  const userId = req.user && req.user.id; // Obtener el ID del usuario de la petición

  try {
    const user = await authService.getAuthenticatedUser(userId);
    if (!user.profiles || !user.profiles.length || user.profiles[0].role.name !== 'admin') {
      return res.status(401).json({
        error: {
          status: 401,
          message: 'User is not authorized to perform this action',
          details: 'User does not have admin role' //Error while checking user roles
        }
      });
    }

    // Solo permitir actualizar los campos "name" y "description"
    const allowedFields = [
      'name',
      'description'
    ];
    const fieldsToUpdate = Object.keys(req.body);

    const isValidUpdate = fieldsToUpdate.every(field => allowedFields.includes(field));

    if (!isValidUpdate) {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Update failed',
          details: 'Only name and description fields are allowed to be updated',
          fields: {
            name: 'String',
            description: 'String'
          }
        }
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: 'User is not authorized to perform this action'
      }
    });
  }
}




//add tag
async function isAdminCreateTag(req, res, next) {
  const userId = req.user && req.user.id; // Obtener el ID del usuario de la petición

  try {
    const user = await authService.getAuthenticatedUser(userId);
    if (!user.profiles || !user.profiles.length || user.profiles[0].role.name !== 'admin') {
      return res.status(401).json({
        error: {
          status: 401,
          message: 'User is not authorized to perform this action',
          details: 'User does not have admin role' //Error while checking user roles
        }
      });
    }

    // Verificar que se estén enviando los campos requeridos para crear un tag
    const requiredFields = ['name', 'description'];
    const fields = Object.keys(req.body);
    const missingFields = requiredFields.filter(field => !fields.includes(field));

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Missing fields',
          details: `The following fields are required: ${missingFields.join(', ')}`
        }
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: 'User is not authorized to perform this action'
      }
    });
  }
}


//add image in tag
async function isAdminAddImage(req, res, next) {
  const userId = req.user && req.user.id; // Obtener el ID del usuario de la petición

  try {
    const user = await authService.getAuthenticatedUser(userId);
    if (!user.profiles || !user.profiles.length || user.profiles[0].role.name !== 'admin') {
      return res.status(401).json({
        error: {
          status: 401,
          message: 'User is not authorized to perform this action',
          details: 'User does not have admin role' //Error while checking user roles
        }
      });
    }

    // Verificar si es una solicitud POST para agregar una imagen
    if (req.method !== 'POST') {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Invalid request method',
          details: 'Only POST requests are allowed for adding images'
        }
      });
    }

    // Verificar si se proporciona el campo "image_url" en la solicitud
    const { image_url } = req.body;
    if (!image_url) {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Missing fields',
          details: 'The following fields are required: image_url',
          fields: {
            image_url: 'String'
          }
        }
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: 'User is not authorized to perform this action'
      }
    });
  }
}






module.exports = {
  isAdminRole,
  isAdminOrSameUserOrAnyUser,
  isTheSameUser,
  isAdminUpdate,
  isAdminCreateTag,
  isAdminAddImage,
  isTheSameUserUpdated
};
