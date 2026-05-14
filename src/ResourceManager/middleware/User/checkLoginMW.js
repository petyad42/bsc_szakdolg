const requireOption = require('../requireOption');
const jwt = require("jsonwebtoken");

function isValid(str) {
    return typeof str === 'string' && str.length === 24 && /^[0-9A-Z]+$/i.test(str);
}

function isValidEmail(str) {
    return typeof str === 'string' && str.length === 24 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i.test(str);
}


module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository,'UserModel')

    return async function(req, res, next) {
        console.log("Checking login!")
        res.locals.loginerror = false;


        if ((typeof req.body.email === 'undefined')||(typeof req.body.password === 'undefined')){
            console.log("Email or passw is undefined")
            console.log(req.body.email)
            console.log(req.body.password)
            return next();
        }
        console.log(req.body.email)
        console.log(req.body.password)

        await UserModel.findOne({email: req.body.email})
            .then (function (result) {
                if(result===null) {
                    throw new Error('Uh-oh!');
                }
            //check password
                console.log("Found the user!")
            if (result.password !== req.body.password) {
                res.locals.loginerror = true
                return next();
            }
                console.log("Checked password about to login!")
            //login is ok, save id to session

                const user = {
                    _id: result._id,
                    username: result.username,
                    isAdmin: result.isAdmin
                };

                const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' });

                res.cookie('token', token, { httpOnly: true });
                console.log("LOGGED IN");
                return res.redirect('/resource');

        })
            .catch((error)=>{
                res.locals.loginerror = true;
                return next();
            })
    };
};