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
const createTag = async(req, res, next) => {
  try{
    let {body} = req;
    let tag = await tagsService.createTeag(body);
    return res.status(201).json({results: tag, message: 'Tag Added'});
  } catch (error) {
    next(error);
  }
}
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
  deleteTag
}