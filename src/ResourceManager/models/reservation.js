const Schema = require('mongoose').Schema;
const db = require('../config/db')
const moment = require("moment-timezone");
const dateBudapest = moment.tz(Date.now(), 'Europe/Budapest');
const ObjectId = Schema.ObjectId;

const Reservation = db.model('Reservation',{
    eventID: ObjectId,
    starts: {type: Date, default: dateBudapest},
    ends: {type: Date, default: dateBudapest},
    repeats: {
        type: String,
        enum:['NONE','DAILY','WEEKLY','MONTHLY','YEARLY'],
    },
    endRepeat: {type: Date, default: dateBudapest},
    resourceID:{type: Schema.Types.ObjectId,ref: 'Resource'}
});

module.exports = Reservation;