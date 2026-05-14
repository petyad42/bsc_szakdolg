const renderMW = require('../middleware/renderMW');
const generateTraffic = require('../middleware/generateTraffic')

const authMW = require('../middleware/auth/authMW');
const inverseAuthMW = require('../middleware/auth/inverseAuthMW');
const mainRedir = require('../middleware/mainredirMW');
const logoutMW = require('../middleware/auth/logoutMW');
const checkAdminMW = require('../middleware/auth/checkAdminMW')


const UserModel = require('../models/user');
const getAllUserMW = require('../middleware/User/getAllUserMW');
const getUserMW = require('../middleware/User/getUserMW');
const deleteUserMW = require('../middleware/User/deleteUserMW');
const makeAdminMW = require('../middleware/User/makeAdminMW');
const checkLogin = require('../middleware/User/checkLoginMW')
const checkSignupMW = require('../middleware/User/checkSignupMW');

const ResourceModel = require('../models/resource');
const saveResourceMW = require('../middleware/Resource/saveResourceMW');
const getAllResourceMW = require('../middleware/Resource/getAllResourceMW');
const getResourceMW = require('../middleware/Resource/getResourceMW')
const delResourceMW = require('../middleware/Resource/delResourceMW');


const ReservationModel = require('../models/reservation');
const saveReservationMW = require('../middleware/Reservation/saveReservationMW');
const getAllReservationMW = require('../middleware/Reservation/getAllReservationMW');
const getReservationMW = require('../middleware/Reservation/getReservationMW')
const delReservationMW = require('../middleware/Reservation/delReservationMW');

module.exports = function (app){
    const objRepo = {
        ResourceModel: ResourceModel,
        ReservationModel: ReservationModel,
        UserModel: UserModel
    };
    app.use(
        '/resource/new',
        authMW(objRepo),
        checkAdminMW(objRepo),
        saveResourceMW(objRepo),
        renderMW(objRepo,'resourceeditnew','Új elem'));
    app.get(
        '/resource',
        authMW(objRepo),
        getAllResourceMW(objRepo),
        renderMW(objRepo,'resources','Erőforrások')
    );
    app.get(
        '/resource/:resourceid',
        authMW(objRepo),
        getResourceMW(objRepo),
        renderMW(objRepo,'resource','Erőforrások')
    );
    app.use(
        '/resource/edit/:resourceid',
        authMW(objRepo),
        checkAdminMW(objRepo),
        getResourceMW(objRepo),
        saveResourceMW(objRepo),
        renderMW(objRepo,'resourceeditnew','Modositas')
    );
    app.use(
        '/resource/del/:resourceid',
        authMW(objRepo),
        checkAdminMW(objRepo),
        getResourceMW(objRepo),
        delResourceMW(objRepo)
    )
    app.get(
        '/calendar/:resourceid',
        authMW(objRepo),
        getResourceMW(objRepo),
        getAllReservationMW(objRepo),
        (req,res,next)=>{
            const y = typeof req.query.y !== 'undefined' ? parseInt(req.query.y) : new Date().getFullYear();
            const m = typeof req.query.m !== 'undefined' ? parseInt(req.query.m) : new Date().getMonth();
            res.locals.y=y;
            res.locals.m=m;
            return next();
        },
        renderMW(objRepo,'calendar','Naptár')
    );
    app.use(
        '/calendar/:resourceid/reservation/new',
        authMW(objRepo),
        checkAdminMW(objRepo),
        getResourceMW(objRepo),
        saveReservationMW(objRepo),
        renderMW(objRepo,'reservationnewedit','Új foglalas'));

    app.use(
        '/calendar/:resourceid/reservation/edit/:reservationid',
        authMW(objRepo),
        checkAdminMW(objRepo),
        getResourceMW(objRepo),
        getReservationMW(objRepo),
        saveReservationMW(objRepo),
        renderMW(objRepo,'reservationnewedit','Modositas')
    );

    app.use(
        '/calendar/:resourceid/reservation/del/:reservationid',
        authMW(objRepo),
        checkAdminMW(objRepo),
        getResourceMW(objRepo),
        getReservationMW(objRepo),
        delReservationMW(objRepo)
    );

    app.get(
      '/users',
      authMW(objRepo),
      checkAdminMW(objRepo),
      getAllUserMW(objRepo),
      renderMW(objRepo,'users','Felhasználók')
    );

    app.use(
        '/users/:userid/del',
        authMW(objRepo),
        checkAdminMW(objRepo),
        getUserMW(objRepo),
        deleteUserMW(objRepo)
    );

    app.get(
        '/users/:userid/makeadmin',
        authMW(objRepo),
        checkAdminMW(objRepo),
        getUserMW(objRepo),
        makeAdminMW(objRepo)
    );

    app.use(
        '/signup',
        checkSignupMW(objRepo),
        renderMW(objRepo,'signup','Regisztracio')
    );

    app.use(
        '/login',
        inverseAuthMW(objRepo),
        checkLogin(objRepo),
        renderMW(objRepo,'login','Bejelentkezes')
    );
    app.get(
        '/logout',
        logoutMW(objRepo),
        (req,res,next)=>{
            res.redirect('/login')
        }
    );
    app.get(
        '/',
        inverseAuthMW(objRepo),
        mainRedir(objRepo),
        renderMW(objRepo,'index','Bejelentkezes')
    );

    app.get(
        '/traffic',
        generateTraffic(10),
        mainRedir(objRepo),
    );

};