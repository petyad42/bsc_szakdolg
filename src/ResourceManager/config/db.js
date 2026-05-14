const mongoose = require('mongoose');
const MONGO_HOST = process.env.MONGO_HOST || '127.0.0.1:27017'

const MONGO_URI = process.env.MONGO_URI
const MONGO_DB= process.env.MONGO_DB||'resourcemanager';

mongoose.connect(`mongodb://${MONGO_HOST}/${MONGO_DB}`,{useNewUrlParser: true});
console.log(`========CONNECTED TO ${MONGO_DB} - DATABASE=============`)

module.exports = mongoose;


