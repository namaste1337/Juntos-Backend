/////////////////////////
// Requires
///////////////////////// 

let userModel                = require("./../models/user");
let projectModel             = require("./../models/projects");
let authenticate        = require("./../common/authentication")
 
module.exports =  function(express, version, passport){

  // Route
  const PROJECT_ROUTE = "/projects";

	function createProject(req, res){

    let project = new projectModel();
    let projectObject = req.body;

    // Add the currently logged in user as the creator
    // Run user through the clean function to remove
    // and sensitive data.
    projectObject.user = userModel.clean(req.user);

    project.createProject(projectObject).then(project => {
      res.jsend.success(projectModel.clean(project));
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