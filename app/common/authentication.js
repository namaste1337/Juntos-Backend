module.exports = {

	// route middleware to make sure a user is logged in
	isLoggedIn: function (req, res, next) {
	
    	// if user is authenticated in the session, carry on 
    	if (req.isAuthenticated())
    	    return next();
	
    	// If user is not logged in return an error
    	res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify({ "Error": "Not logged in" }));
 
	
	}

}