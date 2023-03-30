const router = require('express').Router();

const { getStates } = require('../controllers/states.controller')



router.route('/')
  .get(getStates)

  
module.exports = router