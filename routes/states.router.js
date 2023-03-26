const express = require('express')
const router = express.Router()

const { getStates } = require('../controllers/states.controller')


router.route('/')
  .get(getStates)

module.exports = router