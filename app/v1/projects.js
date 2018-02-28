/////////////////////////
// Models
///////////////////////// 

const userModel     = require("./../models/user");
const projectModel  = require("./../models/projects");

/////////////////////////
// Common Files
///////////////////////// 

const authenticate  = require("./../common/authentication")
const errorCodes    = require("../common/errorCodes.js")
 
module.exports =  function(express, version, passport){

  /////////////////////////
  // Constants
  /////////////////////////

  // Paths
  const PROJECT_ROUTE = "/projects";
  // Errors
  const PROJECT_BY_DISTANCE_ERROR = {
    message: "Error: Missing a geo filter parameters", 
    required_parameters:"lat, lng, radius", 
    example: "?geo=true&lat=123.4&lng=87.2&radius=60000"
  };
  const PROJECT_ID_ERROR = {
    message: "Error: Missing id query parameter", 
    required_parameters:"projects/:id", 
    example: "/projects/1522"
  };

  /////////////////////////
  // Request Handlers 
  /////////////////////////

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

  //Serves as the entry point for the /projects route
  // But will delegate to different methods depending 
  // on the query parameters
  function getProjects(req, res){

    let geoFilter = req.query.geo;

    if(geoFilter){
      getProjectsByDistance(req, res);
      return
    }

    getAllProjects(req, res);

  }

  // Returns all projects ordered by newest
  function getAllProjects(req, res){

    projectModel.find({}).then(projects => {
      return res.jsend.success(projects);
    }).catch(error => {
      console.error(error);
    });

  }

  // Returns the project spcified by project_id
  function getProjectById(req, res){

    let id = req.params.id;

    // TODO: Validations should be handled by
    // express-jason-validator-middleware 
    if(id == null)
      return res.status(errorCodes.ERROR_CODE_400).jsend.fail(PROJECT_ID_ERROR);
    
    projectModel.find().byId(id).then(projects => {
      return res.jsend.success(projects);
    }).catch(error =>{
      console.log(error);
    });

  }

  // Returns projects by radial distance relative to the 
  // longitude and latitude
	function getProjectsByDistance(req, res){

    let lat     = req.query.lat;
    let lng     = req.query.lng;
    let radius  = req.query.radius;

    // TODO: Validations should be handled by
    // express-jason-validator-middleware 
    if(lat == null || lng == null || radius == null)
      return res.jsend.fail(PROJECT_BY_DISTANCE_ERROR);

    projectModel.find().byDistance(parseFloat(lat), parseFloat(lng), parseInt(radius)).then(projects =>{
      return res.status(errorCodes.ERROR_CODE_400).qjsend.success(projects);
    }).catch(error => {
      console.log(error);
    });

	} 

  // TODO: Place holder
  function updateProject(req, res){

  }

  // TODO: Place holder
  function deleteProject(req, res){


  }

  /////////////////////////
  //Routes
  /////////////////////////

  version.use(PROJECT_ROUTE, authenticate.isLoggedIn, express.Router().post("",createProject));
  version.use(PROJECT_ROUTE, authenticate.isLoggedIn, express.Router().get("", getProjects));
  version.use(PROJECT_ROUTE, authenticate.isLoggedIn, express.Router().get("/:id", getProjectById));

}