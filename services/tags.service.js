const { Op } = require('sequelize');
const models = require('../database/models');
const { CustomError } = require('../utils/helpers');

class TagsService {

  constructor() { }
  async findAndCount(query) {
    const options = {
      where: {},
    }

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const { id } = query
    if (id) {
      options.where.id = id;
    }
    const { name } = query
    if (name) {
      options.where.name = { [Op.iLike]: `%${name}%` };
    }
    const { description } = query
    if (description) {
      options.where.description = { [Op.iLike]: `%${description}%` };
    }
    options.distinct = true;

    const tags = await models.Tags.findAndCountAll(options);
    return tags;
  }

  async findTagById(id) {
    let tag = await models.Tags.findByPk(id);
    if (!tag) throw new CustomError('Not found Tag', 404, 'Not found');
    return tag;
  }

  async findTagOr404(id) {
    let tag = await models.Tags.findByPk(id, { raw: true });
    if (!tag) throw new CustomError('Not found Tag', 404, 'Not found');
    return tag;
  }

  async updateTag(id, obj) {
    const transaction = await models.sequelize.transaction();
    try {
      let tag = await models.Tags.findByPk(id);
      if (!tag) throw new CustomError('Not found Tag', 404, 'Not found');
      let tagUdpated = await tag.update(obj, { transaction });
      await transaction.commit();
      return tagUdpated
    } catch (error) {
      await transaction.rollBack();
      throw error
    }
  }

  async createTag({ name, description }) {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const lastTag = await models.Tags.findOne({ order: [['id', 'DESC']] });
      const nextId = lastTag ? lastTag.id + 1 : 1;
      let newTag = await models.Tags.create({ id: nextId, name, description, image_url: '' }, { transaction });
      await transaction.commit();
      return newTag;
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }



  async addImageToTag({ id, image_url }) {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      let tag = await models.Tags.findOne({ where: { id } }, { transaction });
      if (!tag) throw new Error('Tag not found');
      await models.Tags.update({ image_url }, { where: { id }, transaction });
      await transaction.commit();
      return 'Image added successfully';
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }





  async removeTag(id) {
    const transaction = await models.sequelize.transaction();
    try {
      let tag = await models.Tags.findByPk(id);
      if (!tag) throw new CustomError('Not fount Tag', 404, 'NotFound');
      await tag.destroy({ transaction });
      await transaction.commit();
      return tag;
    } catch (error) {
      await transaction.rollBack();
      throw error
    }
  }
}

module.exports = TagsService