const express = require('express')
const router = express.Router()

const { getStates, getState, addState, updateState, removeState } = require('../controllers/states.controller')


router.route('/')
  .get(getStates)

module.exports = router