// Requires 
var jsend = require('jsend');
var User  = require('../models/user');

module.exports =  function(express, version, passport){

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

    version.use('/signup', passport.authenticate('json-signup'), express.Router().post("", signup));
    version.use('/login', passport.authenticate('json-login'), express.Router().post("", login));
    version.use('/logout', express.Router().post("", logout));



    // // Process the login request
    // app.post('/login', passport.authenticate('json-login'), 
    //     function(req, res){
    //         // Remove the unneeded fields for the response
    //         let user = User.clean(req.user);
    //         res.jsend.success({user: user})  
    // });

    // // Process the signup request
    // app.post('/signup', passport.authenticate('json-signup'), 
    //     function(req, res){
    //         // Remove the unneeded fields for the response
    //         let user = User.clean(req.user);
    //         res.jsend.success({user: user})
    // });

    // // Process the logout request
    // app.get('/logout', function(req, res) {
    //     req.logout();
    //     res.jsend.success({unauthenticated: true})
    // });



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

