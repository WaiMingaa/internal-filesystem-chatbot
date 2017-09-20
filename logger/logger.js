var winston = require('winston');
var dateFormat = require('dateformat');

var logger = new(winston.Logger)({
    level :'debug',
    transports: [
           new(winston.transports.Console)({
            timestamp: function () {
                return dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
            }
        }),
      new(winston.transports.File)({
            json: false,
            filename: 'server.log',
            timestamp: function () {
                return dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
            }
        })
    ]
});

module.exports= logger;
