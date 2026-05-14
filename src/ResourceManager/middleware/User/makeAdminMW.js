const requireOption = require('../requireOption');

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository,'UserModel');

    return function (req,res,next){
        if(res.locals.user.isAdmin) {
            res.locals.user.isAdmin = false;
        }
        else {
            res.locals.user.isAdmin = true;
        }
        res.locals.user.save().then(() => console.log('mentve!'));
        res.redirect('/users');
        if(res.locals.user.username===req.session.username){
            req.session.isAdmin = res.locals.user.isAdmin;
        }
        req.session.save(function(err) {
            // session updated
        })
        console.log(`SESSION ${req.session.isAdmin}\nLOCALS: ${res.locals.user.isAdmin} NAME: ${res.locals.user.username}`)

        return next();
    }
};