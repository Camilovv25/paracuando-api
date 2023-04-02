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
    const user = await usersService.getUser(id);
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


const getVotesByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const publications = await usersService.findVotesByUser(id, limit, offset);
    const results = getPagingData(publications, page, limit)
    return res.json(results);
  } catch (error) {
    next(error);
  }
};

const addImageToUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { image_url } = req.body;
    const result = await usersService.addImageToUser({ id, image_url });
    return res.status(200).json({ message: 'Image Added' });
  } catch (error) {
    next(error);
  }
};


const deleteImageFromUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await usersService.deleteImageFromUser(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}


const getUserPublications = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, filters } = req.query;
    const user = await usersService.getUserByPublication(id, page, filters);
    return res.json({ results: user });
  } catch (error) {
    next(error);
  }
};





module.exports = {
  getUsers,
  addUser,
  getUser,
  updateUser,
  removeUser,
  getVotesByUser,
  addImageToUser,
  deleteImageFromUser,
  getUserPublications
};
