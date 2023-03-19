const router = require('express').Router()
const UsersService = require('../services/users.service');
const usersService = new UsersService();

router.route('/')
  .get(usersService.findAndCount)
  .post(usersService.createAuthUser);

router.route('/:id')
  .get(usersService.getUser)
  .put(usersService.updateUser)
  .delete(usersService.removeUser);


module.exports = router;


