// Requires 
var jsend = require('jsend');
var User  = require('../models/user');


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
    function login(req, res){
        //Remove the unneeded fields for the response
        let user = User.clean(req.user);
        res.jsend.success({user: user}) 
    }

    // Handles signup request
    function signup(req, res){
        //Remove the unneeded fields for the response
        let user = User.clean(req.user);
        res.jsend.success({user: user}) 
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

    version.use(SIGNUP_ROUTE, passport.authenticate(JSON_SINGUP_STRATEGY_KEY), express.Router().post(EMPTY_PATH, signup));
    version.use(LOGIN_ROUTE, passport.authenticate(JSON_LOGIN_STRATEGY_KEY), express.Router().post(EMPTY_PATH, login));
    version.use(LOGOUT_ROUTE, express.Router().get(EMPTY_PATH, logout));

};

