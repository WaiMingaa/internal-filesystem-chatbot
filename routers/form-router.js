var formrouter = require('express').Router();
var db = require('./../cloudant/cloudant-service');
formrouter.post('/', function (req, res) {
    var form = req.body;
    //console.log(form);
    db.insertdata(form.title, form.list);
})
module.exports=formrouter;