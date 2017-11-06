/////////////////////////
// Requires
///////////////////////// 

let authenticate = require("./../common/authentication")


module.exports =  function(express, version, passport){

  // Route
  const PROJECT_ROUTE = "/project";

	function createProjects(req, res){

	} 

	function getProjects(req, res){
    res.status(200).jsend.success("ok")
	} 

  function updateProjects(req, res){

  }

  function deleteProjects(req, res){


  }

  version.use(PROJECT_ROUTE, authenticate.isLoggedIn, express.Router().get("", getProjects))

}