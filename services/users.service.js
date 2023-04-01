const { v4: uuid4 } = require('uuid');
const models = require('../database/models')
const { Op } = require('sequelize')
const { CustomError } = require('../utils/helpers');
const { hashPassword } = require('../libs/bcrypt');

class UsersService {

  constructor() {
  }

  async findAndCount(query) {
    const options = {
      where: {},
      attributes: { exclude: ['password'] }
    }

    const { limit, offset } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }

    const { id } = query
    if (id) {
      options.where.id = id
    }

    const { name } = query
    if (name) {
      options.where.name = { [Op.iLike]: `%${name}%` }
    }

    //Necesario para el findAndCountAll de Sequelize
    options.distinct = true

    const users = await models.Users.findAndCountAll(options)
    return users
  }

  async createAuthUser(obj) {
    const transaction = await models.sequelize.transaction()
    try {
      obj.id = uuid4()
      obj.password = hashPassword(obj.password)
      let newUser = await models.Users.create(obj, { transaction, fields: ['id', 'first_name', 'last_name', 'password', 'email', 'username'] })

      let publicRole = await models.Roles.findOne({ where: { name: 'public' } }, { raw: true })
      if (!publicRole) {
        throw new CustomError('Public role not found', 404, 'Not Found')
      }

      let newUserProfile = await models.Profiles.create({ user_id: newUser.id, role_id: publicRole.id }, { transaction })

      await transaction.commit()
      return newUser
    } catch (error) {
      console.log(`Error creating auth user: ${error.message}`)
      await transaction.rollback()
      throw error
    }
  }


  async getAuthUserOr404(id) {
    let user = await models.Users.scope('auth_flow').findByPk(id, { raw: true })
    if (!user) throw new CustomError('Not found User', 404, 'Not Found')
    return user
  }

  async getUser(id) {
    let user = await models.Users.findByPk(id)
    if (!user) throw new CustomError('Not found User', 404, 'Not Found')
    return user
  }

  async findUserByEmailOr404(email) {
    if (!email) throw new CustomError('Email not given', 400, 'Bad Request')
    let user = await models.Users.findOne({ where: { email } }, { raw: true })
    if (!user) throw new CustomError('Not found User', 404, 'Not Found')
    return user
  }

  async updateUser(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let user = await models.Users.findByPk(id)
      if (!user) throw new CustomError('Not found user', 404, 'Not Found')
      let updatedUser = await user.update(obj, { transaction })

      if (obj.interests){
        let arrayTags = obj.interests.split(',')
        let findedTags = await models.Tags.findAll({
          where: {id: arrayTags},
          attributes: ['id'],
          raw: true 
        })
        if (findedTags.length > 0){
          let tags_ids = findedTags.map(tag => tag['id'])
          await user.addInterest(tags_ids)
        }
      }
      await transaction.commit()
      return updatedUser
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removeUser(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let user = await models.Users.findByPk(id)
      if (!user) throw new CustomError('Not found user', 404, 'Not Found')
      await user.destroy({ transaction })
      await transaction.commit()
      return user
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }


  async setTokenUser(id, token) {
    const transaction = await models.sequelize.transaction()
    try {
      let user = await models.Users.findByPk(id)
      if (!user) throw new CustomError('Not found user', 404, 'Not Found')
      let updatedUser = await user.update({ token }, { transaction })
      await transaction.commit()
      return updatedUser
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }


  async removeTokenUser(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let user = await models.Users.findByPk(id)
      if (!user) throw new CustomError('Not found user', 404, 'Not Found')
      await user.update({ token: null }, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async verifiedTokenUser(id, token, exp) {
    const transaction = await models.sequelize.transaction()
    try {

      if (!id) throw new CustomError('Not ID provided', 400, 'Bad Request')
      if (!token) throw new CustomError('Not token provided', 400, 'Bad Request')
      if (!exp) throw new CustomError('Not exp exist', 400, 'Bad Request')


      let user = await models.Users.findOne({
        where: {
          id,
          token
        }
      })
      if (!user) throw new CustomError('The user associated with the token was not found', 400, 'Invalid Token')
      if (Date.now() > exp * 1000) throw new CustomError('The token has expired, the 15min limit has been exceeded', 401, 'Unauthorized')
      await user.update({ token: null }, { transaction })
      await transaction.commit()
      return user
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async updatePassword(id, newPassword) {
    const transaction = await models.sequelize.transaction()
    try {
      if (!id) throw new CustomError('Not ID provided', 400, 'Bad Request')
      let user = await models.Users.findByPk(id)
      if (!user) throw new CustomError('Not found user', 404, 'Not Found')
      let restoreUser = await user.update({ password: hashPassword(newPassword) }, { transaction })
      await transaction.commit()
      return restoreUser
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }




  async findVotesByUser(userId, page = 1, pageSize = 10) {
    const filteredVotes = await models.Votes.findAll({
      where: {user_id: userId},
      attributes: ['publication_id']
    })
    const publicationsIds = filteredVotes.map(vote => vote.publication_id)
    const results = await models.Publications.findAndCountAll({
      where: {
        id:{
          [Op.in]: publicationsIds
        }
      },
      
    }) 
    return results
    // return {
    //   page,
    //   pageSize,
    //   totalItems: totalVotes,
    //   totalPages: Math.ceil(totalVotes / pageSize),
    //   items: votes.map((vote) => vote.publication),
    // };
  }


  async addImageToUser({ id, image_url }) {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      let tag = await models.User.findOne({ where: { id } }, { transaction });
      if (!tag) throw new Error('User not found');
      await models.User.update({ image_url }, { where: { id }, transaction });
      await transaction.commit();
      return 'Image added successfully';
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  async getUserByPublication(query) {
  // async getUserByPublication(id, page = 1, filters = {}) {
    // const limit = 10; // Cantidad de publicaciones por página
    // const offset = (page - 1) * limit;
    const options = {
      where: { user_id: id },
      include: [
        { model: models.Users, as: 'user', attributes: { exclude: ['password', 'token', 'created_at', 'updated_at'] } },
        { model: models.PublicationsTypes, as: 'publication_type', attributes: { exclude: ['created_at', 'updated_at'] } },
        { model: models.Cities, as: 'city', attributes: { exclude: ['created_at', 'updated_at'] } },
        { model: models.PublicationsImages, as: 'publication_image', attributes: { exclude: ['created_at', 'updated_at'] } },
        { model: models.Tags, as: 'tags', attributes: { exclude: ['created_at', 'updated_at'] } },
      ],
      // limit,
      // offset,
      order: [['created_at', 'DESC']],
    };

    const {limit, offset} = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }
    const {id} = query
    if (id) {
      options.where.id = id;
    }
    const {title} = query
    if (title) {
      options.where.title = { [Op.iLike]: `%${title}%` };
    }
    const {description} = query
    if (description) {
      options.where.description = { [Op.iLike]: `%${description}%` };
    }
    const {content} = query
    if (content) {
      options.where.content = { [Op.iLike]: `%${content}%` };
    }
    const {reference_link} = query
    if (reference_link) {
      options.where.reference_link = { [Op.iLike]: `%${reference_link}%` };
    }

    const userPublications = await models.Publications.findAndCountAll(options);

    if (userPublications.count === 0) throw new CustomError('Not found User', 404, 'Not Found');
    return userPublications
    // const totalPages = Math.ceil(publications.count / limit);

    // return {
    //   publications: publications.rows,
    //   totalPages,
    // };
  }




}


module.exports = UsersService;