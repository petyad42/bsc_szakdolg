const requireOption = require('../requireOption');
function isHex24(str) {
    return typeof str === 'string' && str.length === 24 && /^[0-9A-F]+$/i.test(str);
}



module.exports = function(objectRepository) {
    const ReservationModel = requireOption(objectRepository,'ReservationModel');

    return function (req,res,next){
        if(!isHex24(req.params.reservationid)){
            return next(new Error('Invalid request parameter!'));
        }

        res.locals = res.locals || {};
        ReservationModel.findOne({_id: req.params.reservationid})
            .then(function(reservation){
                if(reservation==null) {
                    return next();
                }
                res.locals.reservation = reservation;
                return next();
            })
            .catch(function (err){
                //console.log(err);
                return next(err);
            });
    }
};