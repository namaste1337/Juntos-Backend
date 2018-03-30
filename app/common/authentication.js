/////////////////////////
// Requires
///////////////////////// 

let errorCodes = require("./errorCodes");


module.exports = {

	// Route middleware to make sure the calling user is logged in.
	isLoggedIn: function (req, res, next) {

    	// If user is authenticated in the session, carry on.
    	if (req.isAuthenticated()){
    		return next();
    	}
   
    	// If user is unauthorized return a 401 error.
    	res.status(errorCodes.ERROR_CODE_401).jsend.fail({message: "Unauthorized" });
 
	}

}