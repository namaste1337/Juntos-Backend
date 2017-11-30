/////////////////////////
// Requires
///////////////////////// 

const User          = require("../models/user");
const errorCodes    = require("../common/errorCodes.js")


module.exports =  function(express, version, passport){

    /////////////////////////
    // Constants
    /////////////////////////

    // Keys
    const JSON_LOGIN_STRATEGY_KEY       = 'json-login';
    // Paths
    const SESSION_ROUTE                 = "/session";
    const EMPTY_PATH                    = "";
    //Error Messages
    const ERROR_INCORRECT_CREDENTIALS   = "Incorrect username or password";

    /////////////////////////
    // Request Handlers 
    /////////////////////////

    // Handles login request
    function login(req, res, next){
        
        passport.authenticate(JSON_LOGIN_STRATEGY_KEY, function(err, user, info){
            if (err) { return next(err); }
            // If the user name or password is incorect password user = false
            if (!user) { 
                return res.status(errorCodes.ERROR_CODE_409).jsend.fail({message:ERROR_INCORRECT_CREDENTIALS});  
            }
            //Remove the unneeded fields for the response
            let userCleaned = User.clean(user);
            res.jsend.success({user: userCleaned}) 

        })(req, res, next);
    }

    // Handles logout request
    function logout(req, res){
        req.logout();
        res.jsend.success({unauthenticated: true})
    }


    /////////////////////////
    //Routes
    /////////////////////////

    version.use(SESSION_ROUTE, express.Router().post(EMPTY_PATH, login));
    version.use(SESSION_ROUTE, express.Router().delete(EMPTY_PATH, logout));

};

