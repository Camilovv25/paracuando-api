const models = require('../database/models');
const { CustomError, setRawWhereOperatorCount } = require('../utils/helpers');
const { Op, cast, literal, where } = require('sequelize');
const uuid = require('uuid')

class PublicationsService {
  constructor() { }

  async findAndCount(query, user_id) {
    const options = {
      where: {},
      include: [
        { model: models.Users, as: 'user', attributes: ['first_name', 'last_name', 'image_url'] },
        { model: models.PublicationsTypes, as: 'publication_type' },
        { model: models.PublicationsImages, as: 'images' },
        { model: models.Tags, as: 'tags', through: { attributes: [] }, required: false, where: {} },
      ],
      attributes: {
        include: [
          [cast(literal(
            '(SELECT COUNT(*) FROM "votes" WHERE "votes"."publication_id" = "Publications"."id")'
          ), 'integer'),
          'votes_count'],
        ]
      },
      having: {}
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    if (user_id) {
      options.include.push({
        model: models.Users,
        as: 'same_vote',
        where: { id: user_id },
        attributes: ['id', 'first_name', 'last_name'],
        required: false,
        through: {
          where: { user_id },
          attributes: []
        }
      })
    }

    const { city_id } = query;
    if (city_id) {
      options.where.city_id = city_id;
    }

    const { publication_type_id } = query;
    if (publication_type_id) {
      let publication_type_id = publication_type_id.split(',')
      options.where.publication_type_id = publication_type_id
    }

    const { title } = query;
    if (title) {
      options.where.title = { [Op.iLike]: `%${title}%` };
    }

    const { description } = query;
    if (description) {
      options.where.description = { [Op.iLike]: `%${description}%` };
    }

    const { content } = query;
    if (content) {
      options.where.content = { [Op.iLike]: `%${content}%` };
    }

    const { created_at } = query
    if (created_at) {
      options.where.created_at = { [Op.lte]: new Date(created_at) }
    }

    const { reference_link } = query;
    if (reference_link) {
      options.where.reference_link = { [Op.iLike]: `%${reference_link}%` };
    }

    const { tags } = query;
    if (tags) {
      let tagsIDs = tags.split(',')
      options.include.push({
        model: models.Tags,
        as: 'filtered_tags',
        required: true,
        where: { id: tagsIDs },
        attributes: { exclude: ['created_at', 'updated_at', 'description'] },
        through: {
          attributes: []
        }
      })
    }

    const { votes_count } = query;
    if (votes_count) {

      let [operator, value] = setRawWhereOperatorCount(votes_count)
      options.where.votes_count = where(literal('(SELECT COUNT(*) FROM "votes" WHERE "votes"."publication_id" = "Publications"."id")'),
        operator,
        value
      )
    }

    options.distinct = true

    const publications = await models.Publications.findAndCountAll(options);
    return publications;
  }


  async addOrSubtractVote(userId, publicationId) {
    const transaction = await models.sequelize.transaction()
    try {
      let currentVote = await models.Votes.destroy({ where: { user_id: userId, publication_id: publicationId } }, { transaction })
      if (currentVote) {
        await transaction.commit()
        return { message: 'Vote Removed', status: 200 }
      }
      else {
        currentVote = await models.Votes.create({
          user_id: userId,
          publication_id: publicationId
        }, { transaction })
        await transaction.commit()
        return { message: 'Vote Created', status: 201 }
      }

    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async createPublication({ title, description, content, reference_link, publication_type_id, user_id, tags }) {
    const transaction = await models.sequelize.transaction()
    try {
      let newPublication = await models.Publications.create({
        id: uuid.v4(),
        user_id: user_id,
        publication_type_id,
        title,
        description,
        content,
        reference_link,
        city_id: 1
      }, { transaction })
      if (tags) {
        let arrayTags = tags.split(',')
        let findedTags = await models.Tags.findAll({
          where: { id: arrayTags },
          attributes: ['id'],
          raw: true
        })
        if (findedTags.length > 0) {
          let tags_ids = findedTags.map(tag => tag['id'])
          await newPublication.setTags(tags_ids, { transaction })
        }
      }
      //await newPublication.addUser(user_id, { through: { vote: true } },{transaction})
      await newPublication.setVote(user_id, { transaction })
      await transaction.commit()
      return { message: 'successfully created' };
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }


  async getPublication(id, user_id) {
    let options = { 
      attributes: {
        include: [[cast(literal('(SELECT COUNT(*) FROM "votes" WHERE "votes"."publication_id" = "Publications"."id")'), 'integer'), 'votes_count']]
      },
      include: [
        { model: models.Users, as: 'user', attributes: ['first_name', 'last_name', 'image_url'] },
        { model: models.PublicationsTypes, as: 'publication_type' },
        { model: models.PublicationsImages, as: 'images' },
        { model: models.Tags, as: 'tags', through: { attributes: [] }, required: false, where: {} },
      ],
    };

    if (user_id) {
      options.include.push({
        model: models.Users,
        as: 'same_vote',
        where: { id: user_id },
        attributes: ['id', 'first_name', 'last_name'],
        required: false,
        through: {
          where: { user_id },
          attributes: []
        }
      })
    }

    const publication = await models.Publications.findByPk(id, options);   

    if (!publication) {
      throw new CustomError('Publication not found', 404, 'Not Found');
    }
    return publication;
  }

  
  async updatePublication(id, obj) {
    let publication = await models.Publications.findByPk(id);
    if (!publication) {
      throw new CustomError('Publication not found', 404, 'Not Found');
    }
    publication = await publication.update(obj);
    return publication;
  }

  async deletePublication(id) {
    const transaction = await models.sequelize.transaction()
    try {
      const publication = await models.Publications.findByPk(id, { transaction })
      if (!publication) {
        throw new CustomError('Publication not found', 404, 'Not Found')
      }
      await publication.destroy({ transaction })
      await transaction.commit()
      return publication
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }


  async findPublicationByTitle(name) {
    const publication = await models.Publications.findOne({ where: { title: name } }, { raw: true });
    if (!publication) throw new CustomError('Publication not found', 404, 'Not Found');
    return publication;
  }


}

module.exports = PublicationsService