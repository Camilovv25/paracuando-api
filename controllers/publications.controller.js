const PublicationsService = require('../services/publications.service');
const { getPagination, getPagingData } = require('../utils/helpers');

const publicationsService = new PublicationsService();

const getPublications = async (req, res, next) => {
  try {
    const { page = 1, size = 10 } = req.query;

    const { limit, offset } = getPagination(page, size);

    const publications = await publicationsService.findAndCount({ limit, offset });

    const results = getPagingData(publications, page, limit);

    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

const addPublication = async (req, res, next) => {
  try {
    const { body } = req;
    const publication = await publicationsService.createPublication(body);
    return res.status(201).json({ results: publication });
  } catch (error) {
    next(error);
  }
};

const getPublication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const publication = await publicationsService.getPublication(id);
    return res.json({ results: publication });
  } catch (error) {
    next(error);
  }
};

const updatePublication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const publication = await publicationsService.updatePublication(id, body);
    return res.json({ results: publication });
  } catch (error) {
    next(error);
  }
};

const removePublication = async (req, res, next) => {
  try {
    const { id } = req.params;
    await publicationsService.deletePublication(id);
    return res.json({ message: 'removed' });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getPublications,
  addPublication,
  getPublication,
  updatePublication,
  removePublication
};
