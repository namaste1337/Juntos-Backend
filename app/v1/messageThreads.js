/////////////////////////


/////////////////////////
// Common Files
///////////////////////// 

const authenticate        = require("./../common/authentication")
const errorCodes          = require("../common/errorCodes.js")
const patchOperations     = require("./../common/patchOperations.js");

////////////////////////
// Services
////////////////////////

const MessageThreadService = require('./../services/messageThreadService');

 
module.exports =  function(express, version, passport){

  /////////////////////////
  // Constants
  /////////////////////////

  // Paths
  const MESSAGE_ROUTE = "/messageThreads";

  /////////////////////////
  // Request Handlers 
  /////////////////////////


  function getAllMessageThreads(req, res){

      // Get filters
      let userIdFilter      = req.query.user_ids != undefined ? req.query.user_ids.split(",").mapToNumber() : undefined;
      let isUniqueSetFilter = req.query.unique_set || false;

      console.log(userIdFilter);

      MessageThreadService.getAllMessageThreads(userIdFilter, isUniqueSetFilter)
      .then((messageThreads) => {
        return res.jsend.success(messageThreads);
      }).catch((error) => {
        console.log(error);
        // 500 Internal error
      })
 
  }

  // Returns a messages from a MessageThread, by the thread _id
  function getMessagesById(req, res){

    // Get filters
    let page                  = parseInt(req.query.page) || 1;
    let limit                 = parseInt(req.query.limit)|| 10;
    // Get MessageThread ID
    let id                    = req.params.id; 

    if(id != undefined ){
      MessageThreadService.getMessagesById(id, page, limit)
      .then((messages) => {
        return res.jsend.success(messages);
      }).catch((error) =>{
        console.log(error);
        // 500 Internal error
      })
    }

    // Return error if no MessageThread ID has been passed
    return res.jsend.fail("Missing id parameter");

  }

  function createMessageThread(req, res){

    let messageThreadObject       = req.body;

    // Retrieve the users_id and the initial message object from the body
    let usersIdsArray             = messageThreadObject.users;
    let initialMessage            = messageThreadObject.message;
    let room                      = messageThreadObject.room;


    MessageThreadService.createMessageThread(usersIdsArray, initialMessage, room)
    .then( messageThread => {
      return res.jsend.success(messageThread);
    }).catch(err => {
      return res.jsend.fail(err);
    });

  }

  function updateMessageThread(req, res){

    let messageThreadPatchObject  = req.body;
    let operation                 = messageThreadPatchObject.operation;
    let object_id                 = req.params.id;
    let message                   = messageThreadPatchObject.message;


    if(operation == patchOperations.PATCH_ADD_MESSAGE){

      MessageThreadService.addMessageById(object_id, message)
      .then((writeOperationResults) => {
        return res.jsend.success(writeOperationResults);
      }).catch((error) => {
      console.trace(error);
        // 500 ineternal error
        return res.jsend.fail("Error");
      });
    }

    return res.jsend.fail("Missing operation parameter");

  }

  /////////////////////////
  // Routes
  /////////////////////////

  version.use(MESSAGE_ROUTE, express.Router().post("", createMessageThread));
  version.use(MESSAGE_ROUTE, express.Router().get("/", getAllMessageThreads));
  version.use(MESSAGE_ROUTE, express.Router().get("/:id/messages", getMessagesById));
  version.use(MESSAGE_ROUTE, express.Router().patch("/:id", updateMessageThread));
  // version.use(PROJECT_ROUTE, authenticate.isLoggedIn, express.Router().get("/:id", getProjectById));

}