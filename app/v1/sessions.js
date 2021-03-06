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
    const ERROR_SESSION_EXPIRED         = "Session Expired"

    /////////////////////////
    // Request Handlers 
    /////////////////////////

    // Handles login request
    function login(req, res, next){
        
        passport.authenticate(JSON_LOGIN_STRATEGY_KEY, function(err, user, info){
            if (err) { return next(err); }
            // If the user name does not exist or the password is wrong, the user parameter
            // will be returned as false.
            if (!user) { 
                return res.status(errorCodes.ERROR_CODE_409).jsend.fail({message:ERROR_INCORRECT_CREDENTIALS});  
            }

            //Before returning a response, remove all sensitive user data.
            let userCleaned = User.clean(user);
            res.jsend.success({user: userCleaned}) 

        })(req, res, next);
    }

    // Handles requests to check if user session is active.
    // If the session is still active, the response return 
    // a user object.
    function ping(req, res){

        let user = req.user;
        if(user == undefined){
            return res.status(errorCodes.ERROR_CODE_401).jsend.fail({message:ERROR_SESSION_EXPIRED});  
        }
        // Cleans the user object of any sensitive data 
        // and returns the reponse.
       res.jsend.success(User.clean(user));

    }

    // Handles logout request.
    function logout(req, res){
        req.logout();
        res.jsend.success({unauthenticated: true})
    }


    /////////////////////////
    //Routes
    /////////////////////////

    version.use(SESSION_ROUTE, express.Router().post(EMPTY_PATH, login));
    version.use(SESSION_ROUTE, express.Router().get(EMPTY_PATH, ping));
    version.use(SESSION_ROUTE, express.Router().delete(EMPTY_PATH, logout));

};

