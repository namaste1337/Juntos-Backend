/////////////////////////
// Models
///////////////////////// 

const MessageThreadsModel     = require("./../models/messageThreads");

/////////////////////////
// Common Files
///////////////////////// 

const authenticate        = require("./../common/authentication")
const errorCodes          = require("../common/errorCodes.js")
const patchOperations     = require("./../common/patchOperations.js");
 
module.exports =  function(express, version, passport){

  /////////////////////////
  // Constants
  /////////////////////////

  // Paths
  const MESSAGE_ROUTE = "/messageThreads";


  // Constants 


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

    let messageThreadModel        = new MessageThreadsModel();
    let messageThreadObject       = req.body;

    // Retrieve the users_id and the initial message object from the body
    let usersIdsArray             = messageThreadObject.users;
    let initialMessage            = messageThreadObject.message;


    messageThreadModel.createMessageThread(usersIdsArray, initialMessage).then( messageThread => {
      res.jsend.success(messageThread);
    }).catch(err => {
      res.jsend.fail(err);
    });

  }


  function updateMessageThread(req, res){

    // let messageThreadModel        = new MessageThreadsModel();
    let messageThreadPatchObject  = req.body;

    let operation                 = messageThreadPatchObject.operation;
    let object_id                 = req.params.id;
    let message                   = messageThreadPatchObject.message;


    if(operation == patchOperations.PATCH_ADD_MESSAGE){

      MessageThreadsModel.addMessageById(object_id, message).then((writeOperationResults) => {
        res.jsend.success(writeOperationResults);
      }).catch((error) => {
        console.trace(error);
      })

    }

    // res.jsend.fail("Missing operation parameter");

  }

  /////////////////////////
  // Routes
  /////////////////////////

  version.use(MESSAGE_ROUTE, express.Router().post("", createMessageThread));
  version.use(MESSAGE_ROUTE, express.Router().patch("/:id", updateMessageThread));
  // version.use(PROJECT_ROUTE, authenticate.isLoggedIn, express.Router().get("", getProjects));
  // version.use(PROJECT_ROUTE, authenticate.isLoggedIn, express.Router().get("/:id", getProjectById));

}