
'use strict';
require('dotenv').config({
    silent: true
});

var express = require('express'); // app server
var fs = require('fs')
var path = require('path')
var bodyParser = require('body-parser'); // parser for post requests
var watson = require('watson-developer-cloud'); // watson sdk
// The following requires are needed for logging purposes
var fs = require('fs');
var logger = require('./logger/logger');
var httplogger =require('./logger/http-logger');
var request = require('request');
var message_router = require('./routers/message-router');
var img_upload_router=require('./routers/upload-img-router');
//var form_router = require('./routers/form-router');


var app = express();

//logging
app.use(httplogger);

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json({
    limit: '5mb'
}));
app.use('/api/message',message_router);
// submit form
//app.use('/form',form_router);
// Create the service wrapper


//Endpoint on service file
app.use('/upload',img_upload_router);
app.get("/template", express.static('./templatepage/template.html'));

// Endpoint to convert speech to text
app.post('/api/speechtotext', function (req, res) {
    var postData = {
        "config": {
            "encoding": "FLAC",
            "sampleRateHertz": req.body.rate,
            "languageCode": req.body.lang
        },
        "audio": {
            "content": req.body.blob
        }
    }
    var options = {
        uri: 'https://speech.googleapis.com/v1/speech:recognize?key=' + process.env.GOOGLE_API_KEY,
        method: 'POST',
        json: postData
    };

    request(options, function (error, response, body) {
        logger.debug('Speech : ' + JSON.stringify(body));
        var respjson = {
            'text': ''
        };
        if (Object.keys(body).length == 0 || body.results[0].alternatives[0].confidence < 0.50) {
            res.send(respjson);
        } else {
            var tran = body.results[0].alternatives[0].transcript;
            respjson = {
                'text': tran
            };
            res.send(respjson);
        }
    });

})

app.post('/gencase',function(req,res){

 var data =req.body;
 console.log(data);
var url='http://161.202.198.106:9080/ChatAcmService/acm/StartCaseWf?to='+data.location+'&dpt='+data.dpt+'&rtn='+data.rtn+'&adult='+data.adult+'&child='+data.kid+'&seat='+data.seat+'&hotel='+data.hotel+'&in='+data.dpt+'&out='+data.rtn+'&hadt='+data.adult+'&hchd='+data.kid+'&room='+data.room

  var options = {
        uri: encodeURI(url),
        method: 'GET'
    };

    request(options, function (error, response, body) {
		res.send({'casenumber':body});
    });
})

module.exports = app;
