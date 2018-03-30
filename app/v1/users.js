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
  const JSON_SINGUP_STRATEGY_KEY    = 'json-signup';
  // Route
  const USERS_ROUTE                 = "/users";
  const EMPTY_PATH                  = "";
  // Error messges
  const ERROR_EMAIL_UNAVAILABLE     = "Email is unavailable";
  const ERROR_USERNAME_UNAVAILABLE  = "Username is unavailable"; 

  /////////////////////////
  // Request Handlers 
  /////////////////////////

  // Handles signup request
  function signup(req, res, next){

    // A requirement for the registration, calls for capturing a username,
    // but do to the limitations of passport only supporting email or user.
    // In the following we will check if the username sent by the client
    // exist in our users collection and return the approprite response.
    // Once passport has handles the user creation we append the username
    // to the user object as the last operation of the sign up request.

    let username = req.body.username;

    User.findOne({"local.username" : username}, function(err, user){

      if(user){
         return res.status(errorCodes.ERROR_CODE_409).jsend.fail({message:ERROR_USERNAME_UNAVAILABLE}); 
      }

      passport.authenticate(JSON_SINGUP_STRATEGY_KEY, function(err, user, info){
        if (err) { return next(err); }
        // If the username is unavailable, he user object is return as false.
        if (!user) { 
            return res.status(errorCodes.ERROR_CODE_409).jsend.fail({message:ERROR_EMAIL_UNAVAILABLE}); 
        }
        req.logIn(user, function(err) {

            if (err) { return next(err); }
            
            // If all is well lets append the username to the user object
            user.local.username = username;

            // Save the user to the users collections and return a response
            user.save(function(err){

              if(err)
                throw err;

              //Remove the unneeded fields for the response
              let user = User.clean(req.user);
              // Return the cleaned user object in the reponse body
              res.jsend.success({user: user}) 

            })
        });
      })(req, res, next);
    })

  }

  /////////////////////////
  //Routes
  /////////////////////////

  version.use(USERS_ROUTE, express.Router().post(EMPTY_PATH, signup));

}