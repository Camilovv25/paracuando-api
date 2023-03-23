const PublicationsTypesService = require('../services/publicationsTypes.service')
const {getPagination,getPagingData} = require('../utils/helpers')

const publicationsTypesService = new PublicationsTypesService()

const getPublicationsTypes = async(req, res, next) => {
  try {
    let query = req.query;
    let {page,size} = query;
    const {limit, offset} = getPagination(page,size,'10');
    query.limit = limit;
    query.offset = offset;

    let publicationsTypes = await publicationsTypesService.findAndCount(query);

    const results = getPagingData(publicationsTypes,page,limit);
    
    return res.json({results});
  } catch (error) {
    next(error);
  }
}

const getPublicationTypeOr404 = async(req,res,next) => {
  try{
    let id = req.params.id;
    let publicationType = await publicationsTypesService.findPubblicationTypeOr404(id);
    return res.json({results: publicationType})
  } catch (error) {
    next(error)
  }
}

const updatePublicationType = async (req,res,next) => {
  try{
    const id = req.params.id;
    const obj = req.body;
    let publicationType = await publicationsTypesService.updatePublicationType(id, obj);
    return  res.json({results: publicationType})
  } catch (error) {
    next(error)
  }
}

module.exports ={
  getPublicationsTypes,
  getPublicationTypeOr404,
  updatePublicationType
}