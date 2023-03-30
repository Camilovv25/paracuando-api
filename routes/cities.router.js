const router = require('express').Router();

const {getCities} = require('../controllers/cities.controller');


router.route('/')
  .get(getCities);

  
module.exports = router ;