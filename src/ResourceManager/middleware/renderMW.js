const requireOption = require('./requireOption');
const jwt = require("jsonwebtoken");

module.exports = function(objectRepository,viewName,pageTitle) {
    return function(req, res) {
        try {
            const token = req.cookies.token;
            const user = jwt.verify(token,process.env.SECRET)
            res.locals.isAdmin = user.isAdmin;
            res.locals.username = user.username;
        }
        catch (err){

        }
        res.locals.pagetitle = pageTitle;

        res.render(viewName);

    };
};