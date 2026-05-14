const requireOption = require('../requireOption');

function isValid(str) {
    return typeof str === 'string' && str.length === 24 && /^[0-9A-Z]+$/i.test(str);
}


module.exports = function(objectRepository) {
    const ResourceModel = requireOption(objectRepository,'ResourceModel');
    return async function(req, res, next) {
        if(res.locals.isCreate===undefined){
            res.locals.isCreate = false;
        }
        console.log(req.body.name)
        if((typeof req.body.name === 'undefined') ||
            (typeof req.body.type === 'undefined')){
            return next();
        }
        /*
        if(!isValid(req.body.name) ||
            !isValid(req.body.type)){
            return next();
        }

         */
        console.log(''+res.locals.resource)
        if(typeof res.locals.resource === 'undefined'){
            res.locals.resource = new ResourceModel();
            res.locals.isCreate = true;
        }


        res.locals.resource.name = req.body.name;
        res.locals.resource.type = req.body.type;

        //res.locals.resource.save().then(() => console.log('mentve!'));
        await res.locals.resource.save()
            .then(() => console.log('mentve!'))
            /*
            .catch(function (err){
                console.log('A SAVE ERRORT DOB')
                return next(err);
            });

             */
        console.log(res.locals.isCreate)
        if(res.locals.isCreate===true){
            console.log('Új cucc')
            return res.redirect('/resource');
        }
        else{
            console.log('Vótmá')
            return res.redirect('/resource/'+res.locals.resource._id.toString());
        }
    };
};