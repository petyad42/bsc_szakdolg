const requireOption = require('../requireOption');

function validatePassword(input){
    const minLen = 8;
    if(input.length<minLen){
        return false;
    }
    return /^[0-9A-Z]+$/i.test(input);
}

function isValid(str) {
    return typeof str === 'string' && str.length === 24 && /^[0-9A-Z]+$/i.test(str);
}

function isValidEmail(str) {
    return typeof str === 'string' && str.length === 24 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i.test(str);
}

module.exports = function (objectRepo) {

    const UserModel = requireOption(objectRepo, 'UserModel');

    return async function (req, res, next) {
        res.locals.passworderror = false;

        //not enough parameter
        if ((typeof req.body.username === 'undefined') || (typeof req.body.email === 'undefined') ||
            (typeof req.body.password === 'undefined')) {
            return next();
        }
/*
        if (!isValid(req.body.username) ||
            !isValidEmail(req.body.email) ||
            !isValid(req.body.password)) {
            return next();
        }

 */



        //finding a user with the given email
        await UserModel.findOne({email: req.body.email})
            .then(function (result) {
            if (result !== null) {
                return next();
            }

            if (req.body.username.length < 3) {
                return next();
            }


            if(!validatePassword(req.body.password)){
                res.locals.passworderror = true;
                console.log('Invalid password')
                return next();
            }



            //create user
            //const newUser = new UserModel();
                if(res.locals.newUser===undefined){
                    res.locals.newUser = new UserModel();
                }
            //res.locals.newUser = new UserModel();
            res.locals.newUser.username = req.body.username;
            res.locals.newUser.email = req.body.email;
            res.locals.newUser.password = req.body.password;
            res.locals.newUser.save().then(() => {return res.redirect('/login');});
        });
    };
};