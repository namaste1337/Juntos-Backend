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

    function login(req, res){
        //Remove the unneeded fields for the response
        let user = User.clean(req.user);
        res.jsend.success({user: user}) 
    }



    function signup(req, res){
        //Remove the unneeded fields for the response
        let user = User.clean(req.user);
        res.jsend.success({user: user}) 
    }



    function logout(req, res){
        req.logout();
        res.jsend.success({unauthenticated: true})
    }

    /////////////////////////
    //Routes
    /////////////////////////

    version.use(SIGNUP_ROUTE, passport.authenticate(JSON_SINGUP_STRATEGY_KEY), express.Router().post(EMPTY_PATH, signup));
    version.use(LOGIN_ROUTE, passport.authenticate(JSON_LOGIN_STRATEGY_KEY), express.Router().post(EMPTY_PATH, login));
    version.use(LOGOUT_ROUTE, express.Router().post(EMPTY_PATH, logout));

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ "Error": "Not logged in" }));
    // res.redirect('/');
}

