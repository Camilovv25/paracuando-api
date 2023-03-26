const router = require('express').Router();
const {   getPublications,
  addPublication,
  getPublication,
  updatePublication,
  removePublication, } = require('../controllers/publications.controller');
//const { isAdminRole, isTheSameUser, isAdminOrSameUserOrAnyUser } = require('../middlewares/auth.checkers');



router.get('/', getPublications);

router.get('/:id', getPublication);

//router.put('/:id', updatePublication);




//router.get('/:id/votes', getVotes);

//router.get('/:id/publications', getPost);


//router.post('/:id/add-image', updateUser);


//router.delete('/:id/remove-image', removeUser);


module.exports = router;

