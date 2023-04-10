const { v4: uuid4 } = require('uuid');
const models = require('../database/models')
const { Op, cast, literal } = require('sequelize')
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
    let user = await models.Users.findByPk(id, {
      attributes: { exclude: ['token', 'password', 'created_at', 'updated_at', 'username', 'country_id'] },
      include: {
        model: models.Tags,
        as: 'interests',
        through: { attributes: [] },
        required: false,
        where: {}
      }
    });
    if (!user) throw new CustomError('Not found User', 404, 'Not Found');
    return user;
  }


  async getUserForAnyUser(id) {
    let user = await models.Users.findByPk(id, {
      attributes: { exclude: ['token', 'password', 'created_at', 'updated_at', 'username', 'country_id', 'phone', 'email_verified', 'code_phone', 'email'] },
      include: {
        model: models.Tags,
        as: 'interests',
        through: { attributes: [] },
        required: false,
        where: {}
      }
    });
    if (!user) throw new CustomError('Not found User', 404, 'Not Found');
    return user;
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

      if (obj.interests) {
        let arrayTags = obj.interests.split(',')
        let findedTags = await models.Tags.findAll({
          where: { id: arrayTags },
          attributes: ['id'],
          raw: true
        })
        if (findedTags.length > 0) {
          let tags_ids = findedTags.map(tag => tag['id'])
          await user.addInterests(tags_ids)
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

      if (user.image_url) throw new CustomError('Image User is on Cloud, must be deleted first', 400, 'Bad Request')

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


  async findVotesByUser(userId, query) {
    const filteredVotes = await models.Votes.findAll({
      where: { user_id: userId },
      attributes: ['publication_id']
    })
    const publicationsIds = filteredVotes.map(vote => vote.publication_id)
    const votes = await models.Publications.findAndCountAll({
      where: {
        id: {
          [Op.in]: publicationsIds
        }
      },
      include: [
        { model: models.Users, as: 'user', attributes: ['first_name', 'last_name', 'image_url'] },
        { model: models.Tags, as: 'tags', through: { attributes: [] }, required: false, where: {} },
        { model: models.PublicationsTypes, as: 'publication_type' },
        { model: models.PublicationsImages, as: 'images' },
      ],
      attributes: {
        // exclude: ['content'],
        include: [
          [cast(literal(
            '(SELECT COUNT(*) FROM "votes" WHERE "votes"."publication_id" = "Publications"."id")'
          ), 'integer'),
          'votes_count'],
        ]
      },

    })
    return votes
  }


  async findUserImage({ id, image_url }) {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      let user = await models.Users.findOne({ where: { id } }, { transaction });
      if (!user) throw new Error('User not found');
      const addImage = await models.Users.update({ image_url }, { where: { id }, transaction });
      await transaction.commit();
      return addImage;
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  async removeUserImage({ id }) {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      let user = await models.Users.findOne({ where: { id } }, { transaction });
      if (!user) throw new Error('User not found');

      if (user.image_url) {

        const removeImage = await models.Users.update({ image_url: null }, { where: { id }, transaction });
        await transaction.commit();
        return removeImage;
      } else {

        throw new Error('User does not have an image');
      }
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }



  async findUserPublication(userId, query) {
    const options = {
      where: { user_id: userId },
      attributes: {
        include: [[cast(literal('(SELECT COUNT(*) FROM "votes" WHERE "votes"."publication_id" = "Publications"."id")'), 'integer'), 'votes_count']]
      },
      include: [
        { model: models.Users, as: 'user', attributes: ['first_name', 'last_name', 'image_url'] },
        { model: models.Tags, as: 'tags', through: { attributes: [] }, required: false, where: {} },
        { model: models.PublicationsTypes, as: 'publication_type' },
        { model: models.PublicationsImages, as: 'images' },
      ],
      order: [['created_at', 'DESC']],
    };

    const { limit, offset } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }
    const { id } = query
    if (id) {
      options.where.id = id;
    }
    const { title } = query
    if (title) {
      options.where.title = { [Op.iLike]: `%${title}%` };
    }
    const { description } = query
    if (description) {
      options.where.description = { [Op.iLike]: `%${description}%` };
    }
    const { content } = query
    if (content) {
      options.where.content = { [Op.iLike]: `%${content}%` };
    }
    const { reference_link } = query
    if (reference_link) {
      options.where.reference_link = { [Op.iLike]: `%${reference_link}%` };
    }

    const userPublications = await models.Publications.findAndCountAll(options);

    if (userPublications.count === 0) throw new CustomError('Not found User', 404, 'Not Found');
    return userPublications
  }

}


module.exports = UsersService;