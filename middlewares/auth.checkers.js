const AuthService = require('../services/auth.service');
const PublicationServices = require('../services/publications.service');
const UsersServices = require('../services/users.service');


const authService = new AuthService();
const publicationsService = new PublicationServices();
const userService = new UsersServices();



// checks if the user has admin role
async function isAdminRole(req, res, next) {
  const userId = req.user.id;

  try {
    const user = await authService.getAuthenticatedUser(userId);
    if (!user.profiles || !user.profiles.length || user.profiles[0].role.name !== 'admin') {
      return res.status(403).json({
        error: {
          status: 403,
          message: 'User is not authorized to perform this action',
          details: 'User does not have admin role'
        }
      });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(403).json({
      error: {
        message: 'User is not authorized to perform this action'
      }
    });
  }
}



// checks if the user has admin role, is the same user or is any authenticated user. 
async function isAdminOrSameUserOrAnyUser(req, res, next) {
  const userId = req.params.id;

  try {
    const authenticatedUser = await authService.getAuthenticatedUserFromRequest(req);
    const isAdmin = authenticatedUser.profiles && authenticatedUser.profiles.some(profile => profile.role.name === 'admin');

    if (isAdmin) {
      return next();
    }

    const user = await authService.getAuthenticatedUser(userId);
    const isCurrentUser = String(user.id) === String(authenticatedUser.id);

    if (isCurrentUser) {
      return next();
    }

    const anyUser = await userService.getUserForAnyUser(userId);
    res.status(200).json({ results: anyUser });

  } catch (error) {
    return res.status(403).json({
      error: {
        status: 403,
        message: 'User is not authorized to perform this action',
      }
    });
  }
}



//checks if the user has administrator role or is the same user who created the publication, to allow access to the methods of the Publications path.
async function isAdminOrSameUserToAccessPublication(req, res, next) {
  const publicationId = req.params.id;
  const userId = req.user.id;

  try {
    const publication = await publicationsService.getPublication(publicationId);

    if (publication.user_id !== userId) {
      const authenticatedUser = await authService.getAuthenticatedUserFromRequest(req);
      const isAdmin = authenticatedUser.profiles && authenticatedUser.profiles.some(profile => profile.role.name === 'admin');

      if (!isAdmin) {
        return res.status(403).json({
          error: {
            status: 403,
            message: 'User is not authorized to perform this action',
          }
        });
      }
    }

    next();
  } catch (error) {
    return res.status(404).json({
      error: {
        status: 404,
        message: 'Publication not found',
      }
    });
  }
}


function isTheSameUser(req, res, next) {
  if (req.user && (req.user.id === req.params.id)) {
    next();
  } else {
    res.status(403).json({
      error: {
        status: 403,
        message: 'User is not authorized to perform this action',
        details: 'User is not the same user'
      }
    });
  }
}

async function isAdminOrSameUser(req, res, next) {
  try {
    const authenticatedUser = await authService.getAuthenticatedUserFromRequest(req);

    if (req.user && (req.user.id === req.params.id)) {
      return next();
    }

    const isAdmin = authenticatedUser.profiles && authenticatedUser.profiles.some(profile => profile.role.name === 'admin');

    if (isAdmin) {
      return next();
    }

    return res.status(403).json({
      error: {
        status: 403,
        message: 'User is not authorized to perform this action',
      }
    });

  } catch (error) {
    return res.status(403).json({
      error: {
        status: 403,
        message: 'User is not authorized to perform this action',
      }
    });
  }
}




//check if the user is the same user to allow to update his information.
function isTheSameUserForUpdate(req, res, next) {
  if (req.user && (req.user.id === req.params.id)) {

    const allowedFields = [
      'first_name',
      'last_name',
      'country_id',
      'code_phone',
      'phone',
      'interests'
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
            interests: '1,2,3'
          }
        }
      });
    }

    req.user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      country_id: req.body.country_id,
      code_phone: req.body.code_phone,
      phone: req.body.phone,
      interests: req.body.interests
    };

    next();
  } else {

    res.status(403).json({
      error: {
        status: 403,
        message: 'User is not authorized to perform this action',
        details: 'User is not the same user'
      }
    });
  }
}



//check if the user has admin role to allow him to update the resource.
async function isAdminUpdate(req, res, next) {
  const userId = req.user.id;

  try {
    const user = await authService.getAuthenticatedUser(userId);
    if (!user.profiles || !user.profiles.length || user.profiles[0].role.name !== 'admin') {
      return res.status(403).json({
        error: {
          status: 403,
          message: 'User is not authorized to perform this action',
          details: 'User does not have admin role'
        }
      });
    }

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
    return res.status(403).json({
      error: {
        message: 'User is not authorized to perform this action'
      }
    });
  }
}



//check if the user has admin role to allow creating a tag.
async function isAdminCreateTag(req, res, next) {
  const userId = req.user.id;

  try {
    const user = await authService.getAuthenticatedUser(userId);
    if (!user.profiles || !user.profiles.length || user.profiles[0].role.name !== 'admin') {
      return res.status(403).json({
        error: {
          status: 403,
          message: 'User is not authorized to perform this action',
          details: 'User does not have admin role'
        }
      });
    }

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
    return res.status(403).json({
      error: {
        message: 'User is not authorized to perform this action'
      }
    });
  }
}



//checks if the user has administrator role to allow adding an image to a tag
async function isAdminAddImage(req, res, next) {
  const userId = req.user.id;

  try {
    const user = await authService.getAuthenticatedUser(userId);
    if (!user.profiles || !user.profiles.length || user.profiles[0].role.name !== 'admin') {
      return res.status(403).json({
        error: {
          status: 403,
          message: 'User is not authorized to perform this action',
          details: 'User does not have admin role'
        }
      });
    }

    // const { image_url } = req.body;
    // if (!image_url) {
    //   return res.status(400).json({
    //     error: {
    //       status: 400,
    //       message: 'Missing fields',
    //       details: 'The following fields are required: image_url',
    //       fields: {
    //         image_url: 'String'
    //       }
    //     }
    //   });
    // }

    next();
  } catch (error) {
    return res.status(403).json({
      error: {
        message: 'User is not authorized to perform this action'
      }
    });
  }
}



module.exports = {
  isAdminRole,
  isAdminOrSameUserOrAnyUser,
  isAdminUpdate,
  isAdminCreateTag,
  isAdminAddImage,
  isTheSameUserForUpdate,
  isAdminOrSameUserToAccessPublication,
  isTheSameUser,
  isAdminOrSameUser
};