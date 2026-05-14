const requireOption = require('../requireOption');
const jwt = require("jsonwebtoken");

module.exports = function(objectRepository,viewName,pageTitle) {

    return function(req, res, next) {
        const token = req.cookies.token;
        try {
            const user = jwt.verify(token,process.env.SECRET);
            req.user = user;
            return next();
        } catch (err) {
            res.clearCookie("token");
            return res.redirect("/login");
        }
    };
};