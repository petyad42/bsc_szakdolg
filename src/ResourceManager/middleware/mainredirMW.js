module.exports = function (objectrepository) {

    return function (req, res, next) {

        if (typeof req.session.user_id === 'undefined') {
            return res.redirect('/login');
        } else {
            return res.redirect('/');
        }
    };

};