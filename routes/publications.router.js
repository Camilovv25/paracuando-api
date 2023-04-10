const router = require('express').Router();


const { getPublications, addPublication, getPublication, removePublication, updateVote } = require('../controllers/publications.controller');

const { isAdminOrSameUserToAccessPublication } = require('../middlewares/auth.checkers');

const { uploadImagePublication, removePublicationImage } = require('../controllers/publicationImages.controller');

const passport = require('../libs/passport');
const { multerPublicationsPhotos } = require('../middlewares/multer.middleware');



const auth = passport.authenticate('jwt', { session: false })



router.route('/')
  .get(getPublications)
  .post(auth, addPublication)

router.route('/:id')
  .get(getPublication)
  .delete(auth, isAdminOrSameUserToAccessPublication, removePublication)

router.route('/:id/vote')
  .post(auth, updateVote)

router.route('/:id/add-image')
  .post(auth, isAdminOrSameUserToAccessPublication, multerPublicationsPhotos.array('image', 3), uploadImagePublication)

router.route('/:id/remove-image/:order')
  .delete(auth, isAdminOrSameUserToAccessPublication, removePublicationImage)


module.exports = router;

