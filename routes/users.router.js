const router = require('express').Router();
const { getUsers, getUser, updateUser} = require('../controllers/users.controller');
const { isAdminRole, isTheSameUser, isAdminOrSameUser} = require('../middlewares/auth.checkers');



router.get('/', isAdminRole, getUsers);

router.get('/:id', isAdminOrSameUser, getUser);

router.put('/:id', isTheSameUser, updateUser);

//router.get('/:id/votes', getVotes);

//router.get('/:id/publications', getPost);


//router.post('/:id/add-image', updateUser);


//router.delete('/:id/remove-image', removeUser);


module.exports = router;

