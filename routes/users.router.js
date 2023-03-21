const express = require('express');
const router = express.Router();
const { getUsers, addUser, getUser, updateUser, removeUser, getVotes, getPost } = require('../controllers/users.controller');
const { isAdminRole, isTheSameUser, isAdminOrSameUser, isAnyRoleByList, isUserLoggedIn } = require('../middlewares/auth.checkers');


router.get('/', isAdminRole, getUsers);

router.get('/:id', isAdminOrSameUser, getUser);

router.put('/:id', isTheSameUser, updateUser);

//router.get('/:id/votes', isUserLoggedIn, getVotes);

//router.get('/:id/publications', isUserLoggedIn, getPost);


//router.post('/:id/add-image', updateUser);


//router.delete('/:id/remove-image', removeUser);


module.exports = router;

