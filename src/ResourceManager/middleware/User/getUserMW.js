const requireOption = require('../requireOption');
function isHex24(str) {
    return typeof str === 'string' && str.length === 24 && /^[0-9A-F]+$/i.test(str);
}



module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository,'UserModel');

    return function (req,res,next){
        if(!isHex24(req.params.userid)){
            return next(new Error('Invalid request parameter!'));
        }
        res.locals = res.locals || {};
        UserModel.findOne({_id: req.params.userid})
            .then(function(user){
                if(user==null) {
                    return next(Error);
                }
                res.locals.user = user;
                return next();
            })
            .catch(function (err){
                console.log(err);
                return next(err);
            });
    }
};