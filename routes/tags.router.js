const router = require('express').Router();

const {getTags, getTag, createTag, updateTag, deleteTag, uploadImageTag} = require ('../controllers/tags.controller');
const { isAdminCreateTag, isAdminAddImage, isAdminUpdate, isAdminRole } = require ('../middlewares/auth.checkers');

const { multerPublicationsPhotos } = require('../middlewares/multer.middleware');



router.route('/')
  .get(getTags)
  .post(isAdminCreateTag, createTag)

router.route('/:id')
  .get(getTag)
  .put(isAdminUpdate, updateTag)
  .delete(isAdminRole, deleteTag)

router.route('/:id/add-image')
  .post(isAdminAddImage, multerPublicationsPhotos.array('image', 1), uploadImageTag)


module.exports = router 