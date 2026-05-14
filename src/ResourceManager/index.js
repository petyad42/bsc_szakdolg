
const bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
const cookieParser = require("cookie-parser");


var app = express();
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "style-src 'self'");
    next();
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'iowqaut9834yutg0423jt0gf3w0q9gfj',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

if(process.env.INIT==='DUMMIES'){
    require('./config/initdbentities')(app);
}
                ////////////INIT

app.use(express.static('static'));


require('./routing/index')(app);


var server = app.listen(3000, function (){
    console.log("Env Var MONGO_HOST: " + process.env.MONGO_HOST)
    console.log("Running on http://localhost:3000")
});

