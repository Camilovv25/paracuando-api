const UsersService = require('../services/users.service');
const { getPagination, getPagingData } = require('../utils/helpers');
const { uploadFile, deleteFile, unlinkFile } = require('../libs/aws')
const { CustomError } = require('../utils/helpers')


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
    const query = req.query
    const { page = 1, size = 10 } = query;
    const { limit, offset } = getPagination(page, size);
    query.limit = limit;
    query.offset = offset
    const publications = await usersService.findVotesByUser(id, query);
    const results = getPagingData(publications, page, limit)
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};


const uploadImageUser = async (req, res, next) => {
  const { id } = req.params;
  const file = req.file; 

  try {
    if (!file) throw new CustomError('No image received', 400, 'Bad Request'); 

    let fileKey = `public/tags/images/user-${id}`; 

    if (file.mimetype === 'image/png') {
      fileKey += '.png';
    } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      fileKey += '.jpeg';
    } else {
      throw new CustomError('Invalid image format', 400, 'Bad Request'); 
    }    

    await uploadFile(file, fileKey); 

    const bucketURL = process.env.AWS_DOMAIN + fileKey; 

    const result = await usersService.findUserImage({ id, image_url: bucketURL });

    return res.status(201).json({ message: 'Image Added' });
  } catch (error) {
    if (file) {
      try {
        await unlinkFile(file.path);
      } catch (error) {
        //
      }
    }
    next(error);
  }
};


const deleteUserImage = async (req, res, next) => {
  
  const { id } = req.params;

  try {
    let { image_url } = await usersService.removeUserImage({ id });

    let awsDomain = process.env.AWS_DOMAIN
    const imageKey = image_url.replace(awsDomain, '')
    await deleteFile(imageKey)

    let userImage = await usersService.removeUserImage({ id });

    return res.status(200).json({ message: 'Image Removed'});
  } catch (error) {
    next(error);
  }
};


const getUserPublications = async (req, res, next) => {
  try {
    const query = req.query
    const { id } = req.params
    const { page, size } = query;
    const { limit, offset } = getPagination(page, size);
    query.limit = limit
    query.offset = offset
    const users = await usersService.findUserPublication(id, query);

    const results = getPagingData(users, page, limit);

    return res.json({ results });
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
  uploadImageUser,
  deleteUserImage,
  getUserPublications
};