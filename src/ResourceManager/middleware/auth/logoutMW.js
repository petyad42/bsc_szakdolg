const jwt = require("jsonwebtoken");
module.exports = function (objectrepository) {

    return function (req, res, next) {
        /*
        const token = req.cookies.token;
        try {
            const user = jwt.verify(token,process.env.SECRET);
            res.clearCookie("token");
            return next();
        } catch (err) {
            res.clearCookie("token");
            return res.redirect("/login");
        }
        req.session.destroy(function (err) {
            return next();
        });

        req.session.destroy(function (err) {
            return next();
        });

         */
        res.clearCookie("token");
        return next();

    };

};