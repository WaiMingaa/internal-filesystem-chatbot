var morgan = require('morgan');
var fs = require('fs');
var path = require('path')

var accessLogStream = fs.createWriteStream(path.join('./', 'access.log'), {
    flags: 'a'
});
var httplogger = morgan('tiny', {stream: accessLogStream});

module.exports = httplogger;