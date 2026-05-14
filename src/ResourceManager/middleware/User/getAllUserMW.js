const requireOption = require('../requireOption');

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository,'UserModel');


    return function(req, res, next) {
        //console.log(`REQUEST ${req.session.isAdmin}`)
        UserModel.find()
            .then(function(users){
                res.locals.users = users;
                return next();
            })
            .catch(function (err){
                console.log("Promise rejected")
                return Promise.reject(err);
            })
            .catch(function (err){
                console.log(err);
                return next(err);
            });

    };
};