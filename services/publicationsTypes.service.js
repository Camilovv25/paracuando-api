const { Op } = require('sequelize')
const models = require('../database/models')
const { CustomError } = require('../utils/helpers')



class PublicationsTypesService {

  constructor(){}
  
  //Paginación y filtrado
  async findAndCount(query) {
    const options = {
      where: {},
    }

    const {limit, offset} = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset 
    }

    const {id} = query
    if ( id ) {
      options.where.id = id 
    }
    const {name} = query
    if ( name ) {
      options.where.name = {[Op.iLike]: `%${name}%`}
    }
    const {description} = query
    if ( description ) {
      options.where.description = {[Op.iLike]: `%${description}%`}
    }

    options.distinct = true 

    const publicationsTypes = await models.PublicationsTypes.findAndCountAll(options)
    return publicationsTypes
  }

  async findPubblicationTypeOr404 (id){
    let publicationType = await models.PublicationsTypes.findByPk(id);
    if (!publicationType) throw new CustomError('Not found publication type', 404, 'Not found')
    return publicationType
  }

  async updatePublicationType(id, obj) {
    const transaction = await models.sequelize.transaction();
    try {
      let publicationType = await models.PublicationsTypes.findByPk(id);
      if (!publicationType) throw new CustomError('Not found publication type', 404, 'Not found');

      await publicationType.update(obj, { transaction });
      await transaction.commit();

      return { message: 'Success Update' }; 
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }



  async findPublicationByName(name) {
    const PublicationsType = await models.PublicationsTypes.findOne({ where: { name } }, { raw: true })
    if (!PublicationsType) throw new CustomError('PublicationsType not found', 404, 'Not Found');
    return PublicationsType
  }

}


module.exports = PublicationsTypesService