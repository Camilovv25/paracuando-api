function isAdminRole(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).send('Unauthorized');
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
    res.status(401).send('Unauthorized');
  }
}

function isAdminOrSameUser(req, res, next) {
  if (req.user && (req.user.role === 'admin' || req.user.id === req.params.id)) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

function isAnyRoleByList(roles) {
  return function (req, res, next) {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  };
}

function isUserLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}


module.exports = {
  isAdminRole,
  isTheSameUser,
  isAdminOrSameUser,
  isAnyRoleByList,
  isUserLoggedIn
};
