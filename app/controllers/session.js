// Requires 
var jsend = require('jsend');

module.exports = function(app, passport) {


    // =====================================
    // LOGIN ===============================
    // =====================================

    // Process the login request
    app.post('/login', passport.authenticate('json-login'), 
        function(req, res){
          res.jsend.success({user: req.user})  
    });

    // Process the signup request
    app.post('/signup', passport.authenticate('json-signup'), 
        function(req, res){
            res.jsend.success({user: req.user})
    });

    // Process the logout request
    app.get('/logout', function(req, res) {
        req.logout();
        res.jsend.success({unauthenticated: true})
    });

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

