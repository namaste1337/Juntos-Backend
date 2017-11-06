let errorCodes = require("./errorCodes");


module.exports = {

	// route middleware to make sure a user is logged in
	isLoggedIn: function (req, res, next) {

    	// if user is authenticated in the session, carry on 
    	if (req.isAuthenticated()){
    		return next();
    	}
   
    	// If user is unauthorized return an error
    	res.status(errorCodes.ERROR_CODE_401).jsend.fail({message: "Unauthorized" });
 
	}

}