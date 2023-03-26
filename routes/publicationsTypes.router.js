const express = require('express');
const router = express.Router();

const {
  getPublicationsTypes,
  getPublicationTypeOr404,
  updatePublicationType } = require('../controllers/publicationsTypes.controller');

const { isAdminUpdate } = require('../middlewares/auth.checkers')

router.get('/', getPublicationsTypes);

router.get('/:id', getPublicationTypeOr404);

router.put('/:id', isAdminUpdate, updatePublicationType)

module.exports = router

