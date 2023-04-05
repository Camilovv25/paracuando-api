const router = require('express').Router();

const { getUsers, getUser, updateUser, getVotesByUser, getUserPublications, addImageToUser, deleteUserImage  } = require('../controllers/users.controller');
const { isAdminRole, isTheSameUserForUpdate, isAdminOrSameUserOrAnyUser, isTheSameUser, isAdminOrSameUser } = require('../middlewares/auth.checkers');



router.route('/')
  .get(isAdminRole, getUsers)

router.route('/:id')
  .get(isAdminOrSameUserOrAnyUser, getUser)
  .put(isTheSameUserForUpdate, updateUser)

router.route('/:id/votes')
  .get(getVotesByUser)

router.route('/:id/publications')
  .get(getUserPublications)

router.route('/:id/add-image')
  .post(isTheSameUser, addImageToUser)

router.route('/:id/remove-image')
  .delete(isAdminOrSameUser, deleteUserImage)


module.exports = router;