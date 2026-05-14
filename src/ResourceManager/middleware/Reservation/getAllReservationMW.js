const requireOption = require('../requireOption');

module.exports = function(objectRepository) {
    const ReservationModel = requireOption(objectRepository,'ReservationModel');

    return function(req, res, next) {
        ReservationModel.find()
            .then(function(reservations){
                res.locals.reservations = reservations.sort();
                res.locals.reservations.sort(function(a,b){
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(a.starts) - new Date(b.starts);
                });
                return next();
            })
            .catch(function (err){
                return next(err);
            });


    };
};