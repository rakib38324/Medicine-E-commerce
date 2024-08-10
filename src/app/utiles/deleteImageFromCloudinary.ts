import { v2 as cloudinary } from 'cloudinary';
import config from '../config/config';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const deleteImageFromCloudinary = (publicId: string) => {
  // Delete the image
  cloudinary.uploader.destroy(publicId, function (error, result) {
    if (error) {
      console.error('Error deleting image:', error);
    } else {
      console.log('Image deleted successfully:', result);
    }
  });
};
