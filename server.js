#!/usr/bin/env node

'use strict';

var server = require('./app');
var ssl = require('./ssl-license');
var https = require('https');
var httpport = process.env.PORT || process.env.VCAP_APP_PORT || 8080;
var httpsport =8081;

server.listen(httpport, function() {
  console.log('Http Server running on port: %d', httpport);
});

 https.createServer(ssl.options, server).listen(httpsport,function(){
	 console.log('Https Server running on port: %d', httpsport);
});
