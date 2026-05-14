const requireOption = require('../requireOption');
const {ObjectId} = require("mongodb");
function isHex24(str) {
    return typeof str === 'string' && str.length === 24 && /^[0-9A-F]+$/i.test(str);
}

module.exports = function(objectRepository) {
    const ResourceModel = requireOption(objectRepository,'ResourceModel');


   return function (req,res,next){
       if(!isHex24(req.params.resourceid)){

           return next(new Error('Invalid request parameter!'));
       }

       res.locals = res.locals || {};
       ResourceModel.findOne({_id: req.params.resourceid})
               .then(function(resource){
                   if(resource==null) {
                       return next();
                   }
                   res.locals.resource = resource;
                   return next();
               })
               .catch(function (err){
                   return next(err);
               });


   }
};