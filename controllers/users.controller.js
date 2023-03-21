const UsersService = require('../services/users.service');
const { getPagination, getPagingData } = require('../utils/helpers');

const usersService = new UsersService();

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, size = 10 } = req.query;

    const { limit, offset } = getPagination(page, size);

    const users = await usersService.findAndCount({ limit, offset });

    const results = getPagingData(users, page, limit);

    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

const addUser = async (request, response, next) => {
  try {
    let { body } = request
    let user = await usersService.createUser(body)
    return response.status(201).json({ results: user })
  } catch (error) {
    next(error)
  }
}


const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await usersService.getUserOr404(id);
    return res.json({ results: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await usersService.updateUser(id, req.body);
    return res.json({ results: user });
  } catch (error) {
    next(error);
  }
};

const removeUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await usersService.removeUser(id);
    return res.json({ message: 'removed' });
  } catch (error) {
    next(error);
  }
};



/*
const getVotes = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const { id: userId } = req.user;
    const votes = await usersService.getVotesByUser(userId, limit, offset);
    res.status(200).json(votes);
  } catch (error) {
    next(error);
  }
};
*/


/*
const getPost = async (req, res, next) => {
  try {
    const userId = req.params.id
    const query = req.query
    const posts = await usersService.getPostsByUser(userId, query)
    res.status(200).json(posts)
  } catch (error) {
    next(error);
  }
};
*/



module.exports = {
  getUsers,
  addUser,
  getUser,
  updateUser,
  removeUser
};
