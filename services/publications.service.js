const models = require('../database/models');
const { CustomError } = require('../utils/helpers');
const { Op } = require('sequelize');
const uuid = require('uuid')

class PublicationsService {
  constructor() { }

  async findAndCount(query) {
    const options = {
      where: {},
      attributes: {exclude:['content']},
      include: [
        { model: models.Users, as: 'user', attributes: {exclude:['email_verified','password','token']}},
        // { model: models.PublicationsTypes, as: 'publication_type' },
        // { model: models.Cities, as: 'city' },
        // { model: models.PublicationsImages, as: 'publication_image' },
        { model: models.Tags, as:'tags', attributes: ['id','name'], through:{attributes:[]}, }// update alias name
      ],
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const { id } = query;
    if (id) {
      options.where.id = id;
    }

    const { user_id } = query;
    if (user_id) {
      options.where.user_id = user_id;
    }

    const { city_id } = query;
    if (city_id) {
      options.where.city_id = city_id;
    }

    const { publication_type_id } = query;
    if (publication_type_id) {
      options.where.publication_type_id = publication_type_id;
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

    const { reference_link } = query;
    if (reference_link) {
      options.where.reference_link = { [Op.iLike]: `%${reference_link}%` };
    }

    const publications = await models.Publications.findAndCountAll(options);
    return publications;
  }

  async createPublication({title, description, content, reference_link, publication_type_id, user_id, tags}) {
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
      },{transaction})
      if (tags){
        let arrayTags = tags.split(',')
        let findedTags = await models.Tags.findAll({
          where:{id: arrayTags},
          attributes: ['id'],
          raw: true
        })
        if (findedTags.length > 0){
          let tags_ids = findedTags.map(tag => tag['id'])
          await newPublication.setPublications_tags(tags_ids, {transaction})
        }
      }
      //await newPublication.addUser(user_id, { through: { vote: true } },{transaction})
      await newPublication.setVote(user_id,{transaction})
      await transaction.commit()
      return newPublication 
    } catch ( error ) {
      await transaction.rollback()
      throw error 
    }
  }

  async getPublication(id) {
    const publication = await models.Publications.findOne({
      where: { id },
      include: [
        { model: models.Users, as: 'user', attributes: { exclude: ['password', 'token', 'created_at', 'updated_at'] } },
        { model: models.PublicationsTypes, as: 'publication_type', attributes: { exclude: ['created_at', 'updated_at'] } },
        { model: models.Cities, as: 'city', attributes: { exclude: ['created_at', 'updated_at'] } },
        { model: models.PublicationsImages, as: 'publication_image', attributes: { exclude: ['created_at', 'updated_at'] }  }, // update alias name
        { model: models.Tags, as: 'tags', attributes: { exclude: ['created_at', 'updated_at'] }  }, // update alias name
      ],
    });
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
    const publication = await models.Publications.destroy({ where: { id } });
    if (!publication) {
      throw new CustomError('Publication not found', 404, 'Not Found');
    }
    return publication;
  }


  async findPublicationByTitle(name) {
    const publication = await models.Publications.findOne({ where: { title: name } }, { raw: true });
    if (!publication) throw new CustomError('Publication not found', 404, 'Not Found');
    return publication;
  }


}

module.exports = PublicationsService
