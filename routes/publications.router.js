const router = require('express').Router();


const { getPublications, addPublication, getPublication, removePublication, updateVote } = require('../controllers/publications.controller');

const { isAdminOrSameUser } = require('../middlewares/auth.checkers');
const passport = require('../libs/passport');

const auth = passport.authenticate('jwt', { session: false })



router.route('/')
  .get(getPublications)
  .post(addPublication)

router.route('/:id')
  .get(getPublication)
  .delete(auth, isAdminOrSameUser, removePublication)

router.route('/:id/vote')
  .post(updateVote)


module.exports = router;

