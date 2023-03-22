const CountriesService = require('../services/countries.service');
const {getPagination, getPagingData} = require('../utils/helpers');

const countryService = new CountriesService()

const getCountries = async (req, res, next) => {

  try {
    let query = req.query;
    let {page, size} = query;
    let {limit, offset} = getPagination(page, size, '10');
    query.limit = limit;
    query.offset = offset; 

    let countries = await countryService.findAndCount(query);
    const results = getPagingData(countries, page, limit);
    return res.json({results});
  } catch (error) {
    next (error);
  }
};

const addCountry = async (req, res, next) => {
  try {
    let {body} = req 
    let country = await countryService.createCountry(body);
    return res.status(201).json({results: country});
  } catch (error) {
    next(error);
  }
};

const getCountry = async (req, res,next) => {
  try {
    let {id} = req.params
    let country = await countryService.getCountry(id);
    return res.status(200).json({results: country});
  } catch (error) {
    next(error);
  }
};

const updateCountry = async(req, res ,next) => {
  try {
    let {id} = req.params;
    let {name} = req.body;
    let country = await countryService.updateCountry(id, name);
    return res.status(200).json({results: country});
  } catch (error) {
    next(error);
  }
};

const removeCountry = async (req, res, next) => {
  try {
    let {id} = req.params;
    let country = await countryService.removeCountry(id);
    return res.json({results:country, message: 'removed'});
  } catch(error) {
    next(error);
  }
};

module.exports = {
  getCountries,
  getCountry,
  updateCountry,
  addCountry,
  removeCountry
}