/////////////////////////
// Requires
///////////////////////// 

const jsend = require('jsend');
const User  = require('../models/user');


module.exports =  function(express, version, passport){

    /////////////////////////
    // Constants
    /////////////////////////

    const JSON_SINGUP_STRATEGY_KEY = 'json-signup';
    const JSON_LOGIN_STRATEGY_KEY  = 'json-login';
    const SIGNUP_ROUTE             = "/signup";
    const LOGIN_ROUTE              = "/login";
    const LOGOUT_ROUTE             = "/logout";
    const EMPTY_PATH               = "";

    /////////////////////////
    // Request Handlers 
    /////////////////////////

    // Handles login request
    function login(req, res, next){
        
        passport.authenticate(JSON_LOGIN_STRATEGY_KEY, function(err, user, info){
            if (err) { return next(err); }
            // If the user name or password ins incorect password return user = false
            if (!user) { 
                return res.status(401).jsend.fail({message:"Incorrect username or password"});  
            }
            //Remove the unneeded fields for the response
            let userCleaned = User.clean(user);
            res.jsend.success({user: userCleaned}) 

        })(req, res, next);
    }

    // Handles signup request
    function signup(req, res, next){
    
        passport.authenticate(JSON_SINGUP_STRATEGY_KEY, function(err, user, info){
             console.log(res.user);
            if (err) { return next(err); }
            if (!user) { return 
                res.status(400);
                res.jsend.fail({message:"Incorrect username or password"}); 
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                //Remove the unneeded fields for the response
                let user = User.clean(req.user);
                res.jsend.success({user: user}) 
            });
        })(req, res, next);

    }

    // Handles logout request
    function logout(req, res){
        req.logout();
        res.jsend.success({unauthenticated: true})
    }

    //Handles sending password reset email
    function sendPasswordResetEmail(req, res){

    }

    //Handles password reset
    function passwordReset(req, res){

    }

    /////////////////////////
    //Routes
    /////////////////////////

    version.use(SIGNUP_ROUTE, express.Router().post(EMPTY_PATH, signup));
    // version.use(SIGNUP_ROUTE, passport.authenticate(JSON_SINGUP_STRATEGY_KEY), express.Router().post(EMPTY_PATH, signup));
    version.use(LOGIN_ROUTE, express.Router().post(EMPTY_PATH, login));
        // version.use(LOGIN_ROUTE, passport.authenticate(JSON_LOGIN_STRATEGY_KEY), express.Router().post(EMPTY_PATH, login));
    version.use(LOGOUT_ROUTE, express.Router().get(EMPTY_PATH, logout));

};

