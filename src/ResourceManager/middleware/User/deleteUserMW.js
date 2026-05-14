const requireOption = require('../requireOption');

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository,'UserModel');


    return async function (req,res,next){
        console.log(req.params.userid);
        if (typeof req.params.userid === 'undefined') {
            res.redirect('/users')
            return next();
        }

        //If the user has been deleted, delete his session -> make it work with cookies maybe?

        /*
        if(req.session.user_id === req.params.userid)
        {
            req.session.destroy(function (err) {});
        }

         */
        await UserModel.deleteOne({_id: req.params.userid})
            .then(() => {
                console.log('Entity deleted');
                res.redirect('/users');
                return next();
            });

    }
};