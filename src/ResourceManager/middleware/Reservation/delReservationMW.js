const requireOption = require('../requireOption');

module.exports = function(objectRepository) {
    const ReservationModel = requireOption(objectRepository,'ReservationModel');


    return async function (req,res,next){
        if (typeof req.params.reservationid === 'undefined') {
            res.redirect('/calendar/'+res.locals.resource._id.toString())
            return next();
        }


        await ReservationModel.deleteOne({_id: req.params.reservationid})
            .then(() => {
                console.log('Entity deleted');
                res.redirect('/calendar/'+res.locals.resource._id.toString())
                return next();
            });

    }
};