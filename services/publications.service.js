const models = require('../database/models');
const { CustomError } = require('../utils/helpers');
const { Op } = require('sequelize');

class PublicationsService {
  constructor() { }

  async findAndCount(query) {
    const options = {
      where: {},
      include: [
        { model: models.Users, as: 'user' },
        { model: models.PublicationsTypes, as: 'publication_type' },
        { model: models.Cities, as: 'city' },
        { model: models.PublicationsImages, as: 'publication_image' },
        { model: models.Tags, as: 'publication_tag' }, // update alias name
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

  async createPublication(obj) {
    const publication = await models.Publications.create(obj);
    return publication;
  }

  async getPublication(id) {
    const publication = await models.Publications.findOne({
      where: { id },
      include: [
        { model: models.Users, as: 'user' },
        { model: models.PublicationsTypes, as: 'publication_type' },
        { model: models.Cities, as: 'city' },
        { model: models.PublicationsImages, as: 'publication_image' }, // update alias name
        { model: models.Tags, as: 'publication_tag' }, // update alias name
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





  async findPublicationsByUser(query) {
    const options = {
      where: {},
      include: [
        //{ model: models.Users, as: 'user' },
        //{ model: models.PublicationsTypes, as: 'publication_type' },
        //{ model: models.Cities, as: 'city' },
        //{ model: models.PublicationsImages, as: 'publication_image' },
        //{ model: models.Tags, as: 'publication_tag' }
      ]
    }

    const { limit, offset } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }

    const { id, user_id, publication_type_id, city_id, title, description, content, reference_link } = query
    if (id) {
      options.where.id = id
    }
    if (user_id) {
      options.where.user_id = user_id
    }
    if (publication_type_id) {
      options.where.publication_type_id = publication_type_id
    }
    if (city_id) {
      options.where.city_id = city_id
    }
    if (title) {
      options.where.title = { [Op.iLike]: `%${title}%` }
    }
    if (description) {
      options.where.description = { [Op.iLike]: `%${description}%` }
    }
    if (content) {
      options.where.content = { [Op.iLike]: `%${content}%` }
    }
    if (reference_link) {
      options.where.reference_link = { [Op.iLike]: `%${reference_link}%` }
    }

    //Necesario para el findAndCountAll de Sequelize
    options.distinct = true

    const publications = await models.Publications.findAndCountAll(options)
    return publications
  }


  async findPublicationByTitle(name) {
    const publication = await models.Publications.findOne({ where: { title: name } }, { raw: true });
    if (!publication) throw new CustomError('Publication not found', 404, 'Not Found');
    return publication;
  }


}

module.exports = PublicationsService
