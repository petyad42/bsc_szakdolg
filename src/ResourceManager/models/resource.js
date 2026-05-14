const Schema = require('mongoose').Schema;
const db = require('../config/db')

const Resource = db.model('Resource',{
    name: String,
    type: String,
});

module.exports = Resource;