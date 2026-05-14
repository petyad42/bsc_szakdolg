const requireOption = require('../requireOption');

module.exports = function(objectRepository) {
    const ResourceModel = requireOption(objectRepository,'ResourceModel');

    return function(req, res, next) {

        ResourceModel.find()
            .then(function(resources){
                res.locals.resources = resources;
                return next();
            })
            .catch(function (err){
                console.log("Promise rejected")
                return Promise.reject(err);
            })
            .catch(function (err){
                console.log("next with error")
                return next(err);
            });

        /*
            res.locals.resources = [
                {name: 'A01', type: 'terem'},
                {name: 'A02', type: 'terem'},
                {name: 'B01', type: 'terem'},
                {name: 'ThinkPad', type: 'eszköz'},
                {name: 'Tűzőgép', type: 'eszköz'},
            ];

         */

    };
};