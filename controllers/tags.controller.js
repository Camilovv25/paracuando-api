const TagsService = require('../services/tags.service');
const {getPagination, getPagingData} = require ('../utils/helpers');
const { uploadFile, deleteFile, unlinkFile } = require('../libs/aws')
const { CustomError } = require('../utils/helpers')

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
    const tag = await tagsService.createTag({ name, description });
    return res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
};



const uploadImageTag = async (req, res, next) => {
  const { id } = req.params;
  const file = req.file; 

  try {
    if (!file) throw new CustomError('No image received', 400, 'Bad Request'); 

    let fileKey = `public/tags/images/tag-${id}`; 
    
    if (file.mimetype === 'image/png') {
      fileKey += '.png';
    } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      fileKey += '.jpeg';
    } else {
      throw new CustomError('Invalid image format', 400, 'Bad Request'); 
    }

    await uploadFile(file, fileKey); 

    const bucketURL = process.env.AWS_DOMAIN + fileKey; 

    const result = await tagsService.findTagImage({ id, image_url: bucketURL });

    return res.status(201).json({ message: 'Image Added' });
  } catch (error) {
    if (file) {
      try {
        await unlinkFile(file.path);
      } catch (error) {
        //
      }
    }
    next(error);
  }
};


const updateTag = async (req, res, next) => {
  try {
    const id = req.params.id;
    const obj = req.body;
    await tagsService.updateTag(id, obj);
    return res.json({ message: 'Success Update' }); 
  } catch (error) {
    next(error);
  }
};


const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tag = await tagsService.findTagById(id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    if (tag.image_url) {
      let awsDomain = process.env.AWS_DOMAIN;
      const imageKey = tag.image_url.replace(awsDomain, '');

      await deleteFile(imageKey);
    }

    const tagRemoved = await tagsService.removeTag(id);

    return res.json({ message: 'removed', results: tagRemoved });
  } catch (error) {
    next(error);
  }
};


module.exports = { 
  getTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
  uploadImageTag
}