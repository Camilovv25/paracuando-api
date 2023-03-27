const router = require('express').Router();
const { getUsers, getUser, updateUser, getVotesByUser, addImageToUser,getUserPublications} = require('../controllers/users.controller');
const {getPublicationsByUser} = require('../controllers/publications.controller');
const { isAdminRole, isTheSameUser, isTheSameUserUpdated, isAdminOrSameUserOrAnyUser} = require('../middlewares/auth.checkers');



router.get('/', isAdminRole, getUsers);//listo

router.get('/:id', isAdminOrSameUserOrAnyUser, getUser);//listo

router.get('/:id/votes', getVotesByUser);

router.put('/:id', isTheSameUserUpdated, updateUser);//listo

router.get('/:id/publications', getUserPublications);//listo

router.post('/:id/add-image', isTheSameUser);//verificar

router.delete('/:id/remove-image', updateUser);//vericar


module.exports = router;

