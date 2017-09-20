var watson = require('watson-developer-cloud'); // watson sdk
require('dotenv').config({
    silent: true
});

module.exports = watson.conversation({
    username: process.env.CONVERSATION_USERNAME || '<username>',
    password: process.env.CONVERSATION_PASSWORD || '<password>',
    version_date: '2016-07-11',
    version: 'v1'
});