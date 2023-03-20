const express = require('express');
const router = express.Router();
const {
  getPublicationsTypes,
  getPublicationTypeOr404,
  updatePublicationType } = require('../controllers/publicationsTypes.controller');

router.get('/', getPublicationsTypes);
router.get('/:id', getPublicationTypeOr404);
router.put('/:id', updatePublicationType)

module.exports = router

