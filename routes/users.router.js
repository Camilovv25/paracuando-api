const router = require('express').Router();
const { getUsers, getUser, updateUser, getVotesByUser} = require('../controllers/users.controller');
const {getPublicationsByUser} = require('../controllers/publications.controller');
const { isAdminRole, isTheSameUser, isAdminOrSameUserOrAnyUser} = require('../middlewares/auth.checkers');



router.get('/', isAdminRole, getUsers);//listo

router.get('/:id', isAdminOrSameUserOrAnyUser, getUser);//listo

router.get('/:id/votes', getVotesByUser);

router.put('/:id', isTheSameUser, updateUser);//listo

router.get('/:id/publications', getPublicationsByUser);//listo

router.post('/:id/add-image', updateUser);//verificar

router.delete('/:id/remove-image', updateUser);//vericar


module.exports = router;

