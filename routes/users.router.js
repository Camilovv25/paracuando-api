const router = require('express').Router();

const { getUsers, getUser, updateUser, getVotesByUser, getUserPublications, uploadImageUser, deleteUserImage  } = require('../controllers/users.controller');
const { isAdminRole, isTheSameUserForUpdate, isAdminOrSameUserOrAnyUser, isTheSameUser, isAdminOrSameUser } = require('../middlewares/auth.checkers');

const { multerPublicationsPhotos } = require('../middlewares/multer.middleware');



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
  .post(isTheSameUser, multerPublicationsPhotos.array('image', 1), uploadImageUser)

router.route('/:id/remove-image')
  .delete(isAdminOrSameUser, deleteUserImage)


module.exports = router;