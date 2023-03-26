const router = require('express').Router();

const {getTags, getTag, createTag, updateTag, deleteTag, addImageToTag} = require ('../controllers/tags.controller');

const { isAdminCreateTag, isAdminAddImage, isAdminUpdate, isAdminRole } = require ('../middlewares/auth.checkers');


router.route('/')
  .get(getTags)
  .post(isAdminCreateTag, createTag)

router.route('/:id')
  .get(getTag)
  .put(isAdminUpdate, updateTag)
  .delete(isAdminRole, deleteTag)

router.post('/:id/add-image', isAdminAddImage, addImageToTag);

module.exports = router 