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
  const ERROR_USER_NAME_UNAVAILABLE   = "Username is unavailable";

  /////////////////////////
  // Request Handlers 
  /////////////////////////

  // Handles signup request
  function signup(req, res, next){
  
      passport.authenticate(JSON_SINGUP_STRATEGY_KEY, function(err, user, info){
          if (err) { return next(err); }
          // If the username is unavailable user = false
          if (!user) { 
              return res.status(errorCodes.ERROR_CODE_409).jsend.fail({message:ERROR_USER_NAME_UNAVAILABLE}); 
          }
          req.logIn(user, function(err) {
              if (err) { return next(err); }
              //Remove the unneeded fields for the response
              let user = User.clean(req.user);
              res.jsend.success({user: user}) 
          });
      })(req, res, next);

  }

  /////////////////////////
  //Routes
  /////////////////////////

  version.use(USERS_ROUTE, express.Router().post(EMPTY_PATH, signup));

}