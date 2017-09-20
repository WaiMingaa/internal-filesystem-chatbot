var fs = require('fs');
var logger = require('./../logger/logger.js');
module.exports ={
    upload :function (req, res,param) {
    var pic = req.files.file;
    var dir=param.dir;
    var recongnition=param.recongnition;
    var id =param.id;
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    pic.mv(dir +"/"+ pic.name, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send(err);
        }
        var params = {
            classifier_ids: id,
            images_file: fs.createReadStream("./"+dir +"/"+ pic.name)
        };
        if (recongnition) {
            recongnition.classify(params, function (err, response) {
                if (err)
                    logger.debug(err);
                else
                    logger.debug('visual : ' + JSON.stringify(response, null, 2))
                res.send(JSON.stringify(response, null, 2));
            });
        }
    });
}}