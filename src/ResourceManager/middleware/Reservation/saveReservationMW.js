const requireOption = require('../requireOption');
const moment = require('moment-timezone');
function isValid(str) {
    return typeof str === 'string' && str.length === 24 && /^[0-9A-Z]+$/i.test(str);
}


module.exports = function(objectRepository) {
    const ReservationModel = requireOption(objectRepository,'ReservationModel');

    return async function(req, res, next) {
        if(res.locals.isCreate===undefined){
            res.locals.isCreate = false;
        }


        if((typeof req.body.starts === 'undefined') ||
            (typeof req.body.ends === 'undefined')/*||
            (typeof req.body.onRepeat === false)*/){
            return next();
        }
        /*
        if(!isValid(req.body.starts) ||
            !isValid(req.body.ends)){
            return next();
        }

         */
        if(typeof res.locals.reservation === 'undefined'){
            res.locals.reservation = new ReservationModel();
            res.locals.isCreate = true;
        }


        //res.locals.reservation.starts = new Date(`October 1, 2023 11:24:00`);
        //res.locals.reservation.ends = new Date(`October 1, 2023 12:24:00`);;
        //console.log("Date/")
        //res.locals.reservation.resourceID = res.locals.resource._id;

        async function saveReserv(){

            res.locals.reservation.starts = req.body.starts;
            res.locals.reservation.ends = req.body.ends;
            res.locals.reservation.resourceID = res.locals.resource._id;
            if(typeof req.body.endrepeat !== 'undefined')
            {
                res.locals.reservation.repeats = req.body.repeats;
                res.locals.reservation.endRepeat = req.body.endrepeat;
            }
            if(req.body.repeats!=='NONE'){
                console.log('ISMETLODIK!!');
            }

            await ReservationModel.findOne({starts:  res.locals.reservation.starts})
                .then (function(existingItem){
                    if (existingItem&&res.locals.isCreate) {
                        // The item already exists
                        console.log(`Item with name '${res.locals.reservation.starts}' already exists.`);
                    } else {
                        // The item doesn't exist
                        console.log(`Item with name '${res.locals.reservation.starts}' does not exist.`);
                        res.locals.reservation.save().then(() => console.log('mentve!'));

                    }
                })


        }

        await saveReserv();

        if(res.locals.isCreate){
            return res.redirect('/calendar/'+res.locals.resource._id.toString());
        }
        else{
            return res.redirect('/calendar/'+res.locals.resource._id.toString());
        }
    };
};