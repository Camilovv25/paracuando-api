const router = require('express').Router();

const { getPublicationsTypes, getPublicationTypeOr404, updatePublicationType } = require('../controllers/publicationsTypes.controller');

const { isAdminUpdate } = require('../middlewares/auth.checkers')
const passport = require('../libs/passport');


const auth = passport.authenticate('jwt', { session: false })


router.route('/')
  .get(getPublicationsTypes)

router.route('/:id')
  .get(getPublicationTypeOr404)
  .put(auth, isAdminUpdate, updatePublicationType)


module.exports = router

