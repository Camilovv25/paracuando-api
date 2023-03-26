const models = require ('../database/models');
const {Op} = require('sequelize');
const {CustomError} = require ( '../utils/helpers')

class CitiesService {
  constructor (){}

  async findAndCount(query) {
    const options = {
      where: {},
    }

    const { limit, offset } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }

    const { name } = query
    if (name) {
      options.where.name = { [Op.iLike]: `%${name}%` }
    }
    const { state_id } = query
    if (state_id ) {
      options.where.name = { [Op.iLike]: `%${state_id }%` }
    }

    options.distinct = true

    const cities = await models.Cities.findAndCountAll(options)
    return cities
  }

  async createCity(obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let newCity = await models.Cities.create({
        state_id: obj.state_id,
        name: obj.name
      }, { transaction })

      await transaction.commit()
      return newCity
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
  
  async getCityOr404(id) {
    let city = await models.Cities.findByPk(id, { raw: true })
    if (!city) throw new CustomError('Not found City', 404, 'Not Found')
    return city
  }

  async getCity(id) {
    let city = await models.Cities.findByPk(id)
    if (!city) throw new CustomError('Not found City', 404, 'Not Found')
    return city
  }

  async updateCity(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let city = await models.Cities.findByPk(id)
      if (!city) throw new CustomError('Not found City', 404, 'Not Found')
      let updatedCity = await city.update(obj, { transaction })
      await transaction.commit()
      return updatedCity
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removeCity(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let city = await models.Cities.findByPk(id)
      if (!city) throw new CustomError('Not found City', 404, 'Not Found')
      await city.destroy({ transaction })
      await transaction.commit()
      return city
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async findCityByName(name) {
    const city = await models.Cities.findOne({ where: { name } }, { raw: true })
    if (!city) throw new CustomError('City not found', 404, 'Not Found');
    return city
  }

}

module.exports = CitiesService