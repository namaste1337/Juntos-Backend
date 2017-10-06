// Requires
var express  		= require('express');
var mongoose 		= require('mongoose');
var passport 		= require('passport');
var flash    		= require('connect-flash');
var morgan       	= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser   	= require('body-parser');
var session      	= require('express-session');
var configDB     	= require('./config/database.js');
var jsend 			= require('jsend');
var passwordReset 	= require('password-reset')({
	uri : "http://localhost:8080/password_reset",
	from : "support@localhost",
	host : "localhost", port : 25
});

// Create Express app instance
var app      	 	= express();

// configurations 
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // Get JSON body information
app.use(jsend.middleware); //Set up Jsend for standardized responses
app.use(passwordReset.middleware); // Set password reset middlware


// required for passport
app.use(session({ secret: 'f239hd794298hfd8623b(&F#(HFFHq93rh98wefh23' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Router, here we will define our versioning
let v1 = express.Router();
// Define version 
app.use('/api/v1', v1);

// Version 1 API's
require('./app/v1/sessions.js')(express, v1, passport); // load our routes and pass in our app and fully configured passport

// Export App as a module
module.exports = app;