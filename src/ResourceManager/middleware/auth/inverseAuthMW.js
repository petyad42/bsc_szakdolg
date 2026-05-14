const requireOption = require('../requireOption');
const jwt = require("jsonwebtoken");

module.exports = function(objectRepository,viewName,pageTitle) {

    return function(req, res, next) {
        /*
        if (typeof req.session.user_id !== 'undefined'){
            return res.redirect('/resource');
        }
        return next();

         */
        const token = req.cookies.token;

        try {
            const user = jwt.verify(token,process.env.SECRET);
            req.user = user;
            return res.redirect("/resource");
        } catch (err) {
            res.clearCookie("token");
            return next();
        }

    };
};