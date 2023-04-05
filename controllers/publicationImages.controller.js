const jwt = require('jsonwebtoken')
const PublicationImagesService = require('../services/publicationImages.service');
//const { getPagination, getPagingData } = require('../utils/helpers');
const {   uploadFile, deleteFile } = require('../libs/aws')
const { CustomError } = require('../utils/helpers')

const publicationImagesService = new PublicationImagesService();



const uploadImagePublication = async (request, response, next) => {

  const publicationID = request.params.id;
  const files = request.files;
  try {
    if (files.length < 1) throw new CustomError('No images received', 400, 'Bad Request');

    let imagesKeys = [];
    let imagesErrors = [];

    let openSpots = await publicationImagesService.getAvailableImageOrders(publicationID)

    await Promise.all(

      openSpots.map(async (spot, index) => {
        try {
          /* In case Open Spots > Images Posted */
          if (!files[index]) return

          let fileKey = `public/publications/images/image-${publicationID}-${spot}`;

          if (files[index].mimetype == 'image/png') {
            fileKey = `public/publications/images/image-${publicationID}-${spot}.png`;
          }

          if (files[index].mimetype == 'image/jpg') {
            fileKey = `public/publications/images/image-${publicationID}-${spot}.jpg`;
          }

          if (files[index].mimetype == 'image/jpeg') {
            fileKey = `public/publications/images/image-${publicationID}-${spot}.jpeg`;
          }

          await uploadFile(files[index], fileKey);

          let bucketURL = process.env.AWS_DOMAIN + fileKey;

          let newImagePublication = await publicationImagesService.createImage(
            publicationID,
            bucketURL,
            spot
          );

          imagesKeys.push(bucketURL)

        } catch (error) {
          imagesErrors.push(error.message)
        }
      })
    );

    //At the end of everything, clean the server from the images
    await Promise.all(
      files.map(async (file) => {
        try {
          //await unlinkFile(file.path);
        } catch (error) {
          //
        }
      })
    );

    return response
      .status(200)
      .json({ results: { message: `Count of uploaded images: ${imagesKeys.length} `, imagesUploaded: imagesKeys, imageErrors: imagesErrors } });

  } catch (error) {
    if (files) {
      await Promise.all(
        files.map(async (file) => {
          try {
            //await unlinkFile(file.path);
          } catch (error) {
            //
          }
        })
      );
    }
    return next(error);
  }
};

const removePublicationImage = async (request, response, next) => {
  const publicationID = request.params.id
  const order = request.params.order
  try {

    let { image_url } = await publicationImagesService.getImageOr404(publicationID, order)
    let awsDomain = process.env.AWS_DOMAIN
    const imageKey = image_url.replace(awsDomain, '')
    await deleteFile(imageKey)
    let publicationImage = await publicationImagesService.removeImage(publicationID, order)

    return response.status(200).json({ message: 'Removed', image: publicationImage })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  uploadImagePublication,
  removePublicationImage
};