const express = require('express');
const router = express.Router();

const {getCountries} = require('../controllers/countries.controller');

router.route('/')
  .get(getCountries)

module.exports = router 