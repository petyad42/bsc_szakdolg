const Schema = require('mongoose').Schema;
const db = require('../config/db')

const User = db.model('User',{
    username: String,
    email: String,
    password: String,
    isAdmin: {type: Boolean, default: false}
});

module.exports = User;