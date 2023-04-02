const router = require('express').Router();

const { getUsers, getUser, updateUser, getVotesByUser, getUserPublications, addImageToUser, deleteImageFromUser } = require('../controllers/users.controller');
const { isAdminRole, isTheSameUserUpdated, isAdminOrSameUserOrAnyUser } = require('../middlewares/auth.checkers');



router.route('/')
  .get(isAdminRole, getUsers)

router.route('/:id')
  .get(isAdminOrSameUserOrAnyUser, getUser)
  .put(isTheSameUserUpdated, updateUser)

router.route('/:id/votes')
  .get(getVotesByUser)

router.route('/:id/publications')
  .get(getUserPublications)

router.route('/:id/add-image')
  .post(addImageToUser)

router.route('/:id/remove-image')
  .delete(deleteImageFromUser)


module.exports = router;