const router = require('express').Router();

const { getUsers, getUser, updateUser, getVotesByUser, getUserPublications } = require('../controllers/users.controller');
const { isAdminRole, isTheSameUserForUpdate, isAdminOrSameUserOrAnyUser } = require('../middlewares/auth.checkers');



router.route('/')
  .get(isAdminRole, getUsers)

router.route('/:id')
  .get(isAdminOrSameUserOrAnyUser, getUser)
  .put(isTheSameUserForUpdate, updateUser)

router.route('/:id/votes')
  .get(getVotesByUser)

router.route('/:id/publications')
  .get(getUserPublications)

//router.post('/:id/add-image');

//router.delete('/:id/remove-image');


module.exports = router;