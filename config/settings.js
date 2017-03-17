var settings = {};

//url to upload any images
settings.imageUploadUrl = './public/uploads/';

//mongodb uri setting
settings.dbUrl = 'mongodb://localhost/saas_mean_app';

//cookie expiration time
settings.cookieMaxAge = 30 * 24 * 3600 * 1000;



module.exports = settings;