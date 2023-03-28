const jwt = require('jsonwebtoken')
const PublicationsService = require('../services/publications.service');
const { getPagination, getPagingData } = require('../utils/helpers');

const publicationsService = new PublicationsService();

const getPublications = async (req, res, next) => {
  try {
    const query = req.query
    const { page, size } = query;

    const { limit, offset } = getPagination(page, size);
    query.limit = limit
    query.offset = offset

    const publications = await publicationsService.findAndCount(query);

    const results = getPagingData(publications, page, limit);

    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

const addPublication = async (req, res, next) => {
  try {
    const { title, description, content, reference_link, publication_type_id, tags } = req.body;
    const token = req.headers['authorization'].split(' ')[1]
    const payload = jwt.decode(token)
    const user_id = payload.id
    const publication = await publicationsService.createPublication({title, description, content, reference_link, publication_type_id, user_id, tags});
    return res.status(201).json({ results: publication, message: 'Publication added' });
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


const getPublicationsByUser = async (req, res, next) => {
  try {
    const { page = 1, size = 10 } = req.query;

    const { limit, offset } = getPagination(page, size);

    const { user_id, publication_type_id, city_id, title, description, content, reference_link } = req.query;

    const publications = await publicationsService.findPublicationsByUser({ limit, offset, user_id, publication_type_id, city_id, title, description, content, reference_link });

    const results = getPagingData(publications, page, limit);

    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublications,
  addPublication,
  getPublication,
  updatePublication,
  removePublication,
  getPublicationsByUser
};
