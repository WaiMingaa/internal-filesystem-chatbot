var watson = require('watson-developer-cloud'); // watson sd
require('dotenv').config({
    silent: true
});
module.exports = {
    landmark: watson.visual_recognition({
        api_key: process.env.VISUAL_RECOGNITION_API_KEY_LANDMARK || '{api_key}',
        version: 'v3',
        version_date: '2016-05-19'
    }),
    claim: watson.visual_recognition({
        api_key: process.env.VISUAL_RECOGNITION_API_KEY_CLAIM || '{api_key}',
        version: 'v3',
        version_date: '2016-05-19'
    }),

}
