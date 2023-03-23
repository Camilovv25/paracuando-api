const CitiesService = require('../services/cities.service');
const { getPagination, getPagingData } = require('../utils/helpers');

const citiesService = new CitiesService();

const getCities = async (request, response, next) => {
  try {
    let query = request.query;
    let { page, size } = query;
    const { limit, offset } = getPagination(page, size, '10');
    query.limit = limit;
    query.offset = offset;

    let cities = await citiesService.findAndCount(query);
    const results = getPagingData(cities, page, limit);
    return response.status(200).json({ results: results });

  } catch (error) {
    next(error);
  }
}

const addCity = async (request, response, next) => {
  try {
    let { body } = request;
    let city = await citiesService.createCity(body);
    return response.status(201).json({ results: city });
  } catch (error) {
    next(error);
  }
}

const getCity = async (request, response, next) => {
  try {
    let { id } = request.params
    let cities = await citiesService.getCityOr404(id)
    return response.json({ results: cities })
  } catch (error) {
    next(error)
  }
}

const updateCity = async (request, response, next) => {
  try {
    let { id } = request.params
    let { name } = request.body
    let city = await citiesService.updateCity(id, { name })
    return response.json({ results: city })
  } catch (error) {
    next(error)
  }
}

const removeCity = async (request, response, next) => {
  try {
    let { id } = request.params
    let city = await citiesService.removeCity(id)
    return response.json({ results: city, message: 'removed' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCities,
  addCity,
  updateCity,
  getCity,
  removeCity
}