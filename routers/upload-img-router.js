var imgrouter = require('express').Router();
var visual_api = require('./../watson/watson-visual');
var imguploader =require('../service/img-uploader-service');
imgrouter.post('/:type',function(req,res){
    var recongnition=null;
    var id=null;
    var dir = req.params.type;
    switch(dir){
        case 'landmark':
            recongnition = visual_api.landmark;
            id = process.env.LANDMARK_CLASSIFIER;
             break;
       case 'claim':
            recongnition = visual_api.claim;
            id = process.env.CLAIM_CLASSIFIER;
            break;
        default:
            recongnition = visual_api.landmark;
    }
    var param={
        recongnition:recongnition,
        id:id,
        dir:dir
    }
    imguploader.upload(req,res,param);
})

module.exports=imgrouter;