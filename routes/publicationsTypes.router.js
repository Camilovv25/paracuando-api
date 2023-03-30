const router = require('express').Router();

const { getPublicationsTypes, getPublicationTypeOr404, updatePublicationType } = require('../controllers/publicationsTypes.controller');

const { isAdminUpdate } = require('../middlewares/auth.checkers')



router.route('/')
  .get(getPublicationsTypes)

router.route('/:id')
  .get(getPublicationTypeOr404)
  .put(isAdminUpdate, updatePublicationType)


module.exports = router

