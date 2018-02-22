/////////////////////////
// Requires
///////////////////////// 

let Project             = require("./../models/projects");
let authenticate        = require("./../common/authentication")
 
module.exports =  function(express, version, passport){

  // Route
  const PROJECT_ROUTE = "/projects";

	function createProject(req, res){

    let project = new Project();
    let projectObject = req.body;

    // Add the currently logged in user as the creator
    projectObject.user = req.user;

    project.createProject(req.body).then(project => {
      res.jsend.success(project);
    }).catch(err => {
      res.jsend.failure(error);
    });

	} 

	function getProject(req, res){



	} 

  function updateProject(req, res){

  }

  function deleteProject(req, res){


  }

  version.use(PROJECT_ROUTE, express.Router().post("",createProject))

}