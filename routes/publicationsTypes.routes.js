const express = require('express');
const router = express.Router();
const {logIn} = require('../controllers/auth.controller')
const {
  getPublicationsTypes,
  getPublicationTypeOr404,
  updatePublicationType } = require('../controllers/publicationsTypes.controller');

router.get('/',logIn, getPublicationsTypes);
router.get('/:id', logIn, getPublicationTypeOr404);
router.put('/:id', updatePublicationType)

module.exports = router

