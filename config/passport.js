// This file configures passport authentication
// middlware

///////////////////////////
// Requires
//////////////////////////

var JsonStrategy    = require('passport-json').Strategy;
var User            = require('../app/models/user');

///////////////////////////
// Constants
//////////////////////////

//JSON prop constants
const USERNAME_PROP_TYPE   = "email";
const PASSWORD_PROP_TYPE   = "password";

// Strategy constants
const SIGNUP_STRATEGY_KEY  = "json-signup";
const LOGIN_STRATEGY_KEY   = "json-login";

///////////////////////////
// Module
//////////////////////////

module.exports = function(passport) {


    ////////////////////////
    /// Helper Methods
    ////////////////////////

    // Handles created a user session
    function createSession(user, req){
        req.logIn(user,{session: true}, () =>{});
    }

    ///////////////////////////
    // Passport session setup
    ///////////////////////////

    // Required for persistent login sessions.
    // Passport needs ability to serialize and 
    // unserialize users out of session.

    // Used to serialize the user for the session.
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Used to deserialize the user.
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    ///////////////////////////
    // JSON Signup
    ///////////////////////////

    // We are using named strategies since we 
    // have one for login and one for signup
    // by default, if there was no name, 
    // it would just be called 'local'.

    passport.use( SIGNUP_STRATEGY_KEY, new JsonStrategy({

        // By default, local strategy uses username and 
        // password, we will override with email.

        usernameProp : USERNAME_PROP_TYPE,
        passwordProp : PASSWORD_PROP_TYPE,
        passReqToCallback : true // Allows us to pass back the entire request to the callback.
    },
    function(req, email, password, done) {

        // Asynchronous
        // User.findOne wont fire unless data is sent back.
        process.nextTick(function() {

        // Find a user whose email is the same as the forms email
        // we are checking to see if the user trying to signup already exists.
        User.findOne({ "local.email" :  email }, function(err, user) {

            // If there are any errors, return the error.
            if (err)
                return done(err);

            // Check to see if theres already a user with that email.
            if (user) {
                return done(null, false);
            } else {

                // If there is no user with that email
                // create the user.
                var newUser            = new User();
                // Set the user's local credentials.
                newUser.local.email          = email;
                newUser.local.password       = newUser.generateHash(password);
                // Set profile image.
                newUser.local.profile.images = [req.body.profileImageName];

                // Save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                        
                    // Create session
                    createSession(user, req);

                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    ///////////////////////////
    // JSON Login
    ///////////////////////////

    // We are using named strategies since we 
    // have one for login and one for signup
    // by default, if there was no name, it 
    // would just be called 'local'.

    passport.use(LOGIN_STRATEGY_KEY, new JsonStrategy({

        // By default, local strategy uses username 
        // and password, we will override with email.
        
        usernameProp : USERNAME_PROP_TYPE,
        passwordProp : PASSWORD_PROP_TYPE,
        passReqToCallback : true // Allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { 

        // Find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists

        User.findOne({ "local.email" :  email }, function(err, user) {
   
            // If there are any errors, return the error before anything else
            if (err)
                return done(err);

            // If no user is found, return user = false
            if (!user)
                return done(null, false); 

            // If the user is found but the password is wrong return user = false
            if (!user.validPassword(password))
                return done(null, false); 

            // Create session
            createSession(user, req);

            // All is well, return successful user.
            return done(null, user);
        });

    }));

};

