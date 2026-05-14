const requireOption = require('../requireOption');
const jwt = require("jsonwebtoken");

module.exports = function(objectRepository,viewName,pageTitle) {
    return function(req, res, next) {
        const token = req.cookies.token;
        const user = jwt.verify(token,process.env.SECRET)
        if(user.isAdmin == false){
            console.log('Unauthorized')
            return res.redirect('/resource');
        }
        console.log("ISADMIN: " + res.locals.isAdmin);
        return next();
        /*
        if (req.session.isAdmin == false){
            console.log('Unauthorized')
            return res.redirect('/resource');
        }
        console.log(res.locals.isAdmin)
        return next();

         */
    };
};