const requireOption = require('../requireOption');

module.exports = function(objectRepository) {
    const ResourceModel = requireOption(objectRepository,'ResourceModel');


   return async function (req,res,next){
    if (typeof req.params.resourceid === 'undefined') {
        res.redirect('/resource')
        return next();
    }


        await ResourceModel.deleteOne({_id: req.params.resourceid})
        .then(() => {
            console.log('Entity deleted');
            res.redirect('/resource')
            return next();
        });

   }
};