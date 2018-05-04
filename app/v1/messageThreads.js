/////////////////////////
// Models
///////////////////////// 

const MessageThreadsModel     = require("./../models/messageThreads");

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
  const MESSAGE_ROUTE = "/messageThreads";

  // const PROJECT_ID_ERROR = {
  // //   message: "Error: Missing id query parameter", 
  // //   required_parameters:"projects/:id", 
  // //   example: "/projects/1522"
  // // };
  // Errors
  // const PROJECT_BY_DISTANCE_ERROR = {
  //   message: "Error: Missing a geo filter parameters", 
  //   required_parameters:"lat, lng, radius", 
  //   example: "?geo=true&lat=123.4&lng=87.2&radius=60000"
  // };
  // const PROJECT_ID_ERROR = {
  //   message: "Error: Missing id query parameter", 
  //   required_parameters:"projects/:id", 
  //   example: "/projects/1522"
  // };

  /////////////////////////
  // Request Handlers 
  /////////////////////////

  function createMessageThread(req, res){

    let messageThreadModel  = new MessageThreadsModel();
    let messageThreadObject = req.body;

    // Retrieve the users array from
    let usersIdsArray = messageThreadObject.users;
    let initialMessage = messageThreadObject.message;


    messageThreadModel.createMessageThread(usersIdsArray, initialMessage).then( messageThread => {
      res.jsend.success(messageThread);
    }).catch(err => {
      res.jsend.fail(err);
    });

  }

  /////////////////////////
  // Routes
  /////////////////////////

  version.use(MESSAGE_ROUTE, express.Router().post("", createMessageThread));
  // version.use(PROJECT_ROUTE, authenticate.isLoggedIn, express.Router().get("", getProjects));
  // version.use(PROJECT_ROUTE, authenticate.isLoggedIn, express.Router().get("/:id", getProjectById));

}