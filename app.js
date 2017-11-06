/////////////////////////
// Requires
///////////////////////// 

//Packages

const express  		= require("express");
const mongoose 		= require("mongoose");
const passport 		= require("passport");
const morgan       	= require("morgan");
const cookieParser 	= require("cookie-parser");
const bodyParser   	= require("body-parser");
const session      	= require("express-session");
const jsend 		= require("jsend");
const fileUpload 	= require('express-fileupload');

// Modules
const configDB     	 = require("./config/database.js");
const configSession  = require("./config/session.js"); 

/////////////////////////
// Constants
///////////////////////// 

const ETAGS_KEY							= "etag";
const PASSPORT_CONFIG_PATH 				= "./config/passport";
const MORGAN_FORMAT		   				= "dev";
const SESSION_SECRET_KEY   				= "f239hd794298hfd8623b(&F#(HFFHq93rh98wefh23";
//Routes
const VERSION_1_PATH					= "/api/v1";
//Static Routes
const USER_PROFILE_IMAGES_PATH 			= "/user_profile_images";
const USER_PROFILE_IMAGES_VIRTUAL_PATH 	= "user_profile_images"
//Controllers
const SESSION_CONTROLLER_FILE_PATH 		= "./app/v1/sessions.js";
const UPLOADS_CONTROLLER_FILE_PATH 		= "./app/v1/uploads.js";
const PROJECTS_CONTROLLER_FILE_PATH     = "./app/v1/projects.js";

/////////////////////////
// Express Instance 
///////////////////////// 

const app      	 	= express();

/////////////////////////
// DB Configs
///////////////////////// 

mongoose.connect(configDB.url); // Connect to our database

/////////////////////////
// Middleware 
///////////////////////// 

require(PASSPORT_CONFIG_PATH)(passport); // Pass passport for configuration
app.use(morgan(MORGAN_FORMAT)); // Log every request to the console
app.use(cookieParser()); // Read cookies (needed for auth)
app.use(bodyParser.json()); // Get JSON body information
app.use(jsend.middleware); //Set up Jsend to standardize responses
app.use(session({ 
secret: configSession.SESSION_SECRET_KEY, // session secret
cookie:{
	maxAge: configSession.SESSION_COOKIE_MAX_AGE // Cookie expires in 90 days
}
})); 
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // persistent login sessions
app.use(fileUpload()) // Set up express-fileupload middleware
app.disable(ETAGS_KEY); // Disabled etags
// Configure user profile images static path
app.use(USER_PROFILE_IMAGES_PATH, express.static(USER_PROFILE_IMAGES_VIRTUAL_PATH)) 

/////////////////////////
// Routing 
///////////////////////// 

// Router, here we will define our versioning
let v1 = express.Router();
// Define version 
app.use(VERSION_1_PATH, v1);
// Version 1 API"s
require(SESSION_CONTROLLER_FILE_PATH)(express, v1, passport); // load our routes and pass in our app and fully configured passport
require(UPLOADS_CONTROLLER_FILE_PATH)(express, v1, passport);
require(PROJECTS_CONTROLLER_FILE_PATH)(express, v1, passport);
// Export App as a module
module.exports = app;