const TagsService = require('../services/tags.service');
const {getPagination, getPagingData} = require ('../utils/helpers');

const tagsService = new TagsService();

const getTags = async(req, res, next) => {
  try{
    let query = req.query;
    let {page, size} = query;
    const {limit, offset} = getPagination(page, size, '10');
    query.limit = limit;
    query.offset = offset;
    let tags = await tagsService.findAndCount(query);
    const results = getPagingData(tags, page, limit);
    return res.status(200).json({results});
  } catch (error) {
    next(error);
  }
}

const getTag = async(req, res, next) => {
  try{
    let {id} = req.params;
    let tag = await tagsService.findTagById(id);
    return res.status(200).json({results: tag})
  } catch (error) {
    next(error);
  }
}

const createTag = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const newTag = await tagsService.createTag({ name, description });
    return res.status(201).json({ results: newTag, message: 'Tag Added' });
  } catch (error) {
    next(error);
  }
};


const addImageToTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { image_url } = req.body;
    const result = await tagsService.addImageToTag({ id, image_url });
    return res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
};

const updateTag = async(req, res, next) => {
  try{
    let {id} = req.params;
    let {body} = req;
    let tag = await tagsService.updateTag(id, body);
    return res.status(200).json({results: tag , message: 'Succes Update'});
  } catch (error) {
    next(error);
  }
}

const deleteTag = async(req, res, next) => {
  try{
    const {id} = req.params;
    await tagsService.removeTag(id);
    return res.json({message: 'Tag Removed' });
  } catch (error) {
    next(error)
  }
}

module.exports = { 
  getTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
  addImageToTag
}