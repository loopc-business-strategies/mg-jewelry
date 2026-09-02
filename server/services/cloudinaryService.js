const { v2: cloudinary } = require('cloudinary');
const { cloudinary: cloudConfig } = require('../config/env');

const isConfigured = () => Boolean(cloudConfig.cloudName && cloudConfig.apiKey && cloudConfig.apiSecret);

if (isConfigured()) {
  cloudinary.config({
    cloud_name: cloudConfig.cloudName,
    api_key: cloudConfig.apiKey,
    api_secret: cloudConfig.apiSecret,
  });
}

const uploadBuffer = (buffer, folder = 'mg-jewelry') =>
  new Promise((resolve, reject) => {
    if (!isConfigured()) {
      return reject(new Error('Cloudinary is not configured'));
    }
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(buffer);
  });

const deleteImage = async (publicId) => {
  if (!isConfigured() || !publicId) return null;
  return cloudinary.uploader.destroy(publicId);
};

module.exports = { isConfigured, uploadBuffer, deleteImage, cloudinary };
