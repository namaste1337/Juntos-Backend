
/////////////////////////
// Modules
/////////////////////////

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var Chance = require('chance');

/////////////////////////
// Initializations
/////////////////////////

// Initialize mongoose-auto-increment 
autoIncrement.initialize(mongoose.connection);

/////////////////////////
// Constants
/////////////////////////

//Errors
const MISSING_USERS_ARRAY_ERROR_STRING        = "Error: Missing userIdsArray parameter";
const MISSING_INTIAL_MESSAGE_OBJECT_STRING    = "Error: Missing initialMessage parameter";
const MISSING_MESSAGE_THREAD_OBJECT_STRING    = "Error: Missing messageThreadObjectId parameter";
const MISSING_MESSAGE_STRING                  = "Error: Missing message parameter";

/////////////////////////
// Schema
/////////////////////////

// Defines the schema for our messages collection
const messageThreadsSchema = mongoose.Schema({

    users : [Number],
    room : String,
    messages : [{
        text: String,
        createdAt: { type : Date, default: Date.now },
        user: {
            _id: Number,
            name: String,
            avatar: String
        },
    }],
    last_update : { type : Date, default: Date.now}

});



/////////////////////////
// Query Helpers
/////////////////////////


/////////////////////////
// Static methods
/////////////////////////

// Removes unneeded fields for the reponse
// Takes a mongoose project entity as a parameter
messageThreadsSchema.statics.clean = function(messageEntity){

    var obj = messageEntity.toObject();
    delete obj._id;
    delete obj.__v;

    return obj;

}

/**
 * Description: Appends a message to an existing message thread.
 *
 * @param {id} id The objectId of the messageThread to append the new message
 *
 * @param {messageObject} message The message object to append to the thread.
 *
 * @return {Object} Returns write operation results.
**/

messageThreadsSchema.statics.addMessageById= function(id, message){

    return new Promise((resolve, reject) => {

      if(id == null){
        console.error(MISSING_MESSAGE_THREAD_OBJECT_STRING);
        return;
      }

      if(message == null){
        console.error(MISSING_MESSAGE_STRING);
        return;
      } 

      //Insert the message to the document
      this.update({_id :  id}, 
        {$push: {messages: message}},
        (error, writeOpResults) => {
          if(error){
            reject(error);
            return;
          }
          if(writeOpResults != null)
            resolve(writeOpResults);
      })

    });

}

messageThreadsSchema.methods.getMessageThread = function(messageThreadId, lastID){


    // if(messageThreadId){



    // }

    //     // Validate parameters
    // if(id == null){
    //     console.error(MISSING_ID_PARAMETER_ERROR_STRING);
    //     return;
    // }


    // if(lastId){
    //     return this.find({'_id'> last_id}).limit(10);    
    // }


    // return this.find(query);

}

/////////////////////////
// Instance methods
/////////////////////////

/**
 * Description: Creates a new message thread.
 *
 * @param {Array} userArray An array contianing the user_ids of the 
 * participants of the message thread.
 *
 * @param {Object} initialMessage The initial message to added to the thread
 *
 * @return {Object} Returns a messageThread object
**/

messageThreadsSchema.methods.createMessageThread  = function(userIdsArray, initialMessage){

 return new Promise((resolve, reject) => {

    if(userIdsArray.length == 0 || userIdsArray == null){
        reject(MISSING_USERS_ARRAY_ERROR_STRING);
        return;
    }

    if(initialMessage == null || typeof initialMessage != "object" ){
        reject(MISSING_INTIAL_MESSAGE_OBJECT_STRING);
        return;
    }

    // Assign the users and room name to the thread
    try {
        this.users      = userIdsArray;
        this.room       = new Chance().guid();
        this.messages   = initialMessage
    } catch(error){
        console.trace(error);
    }

    // Create new messsage thread
    this.save((error, document, isSaveSuccess) => {
        if(error)
            reject(error);
        if(isSaveSuccess === 1)
            resolve(document);
    }).catch(error =>{
        console.trace(error);
    });

 });

}

messageThreadsSchema.methods.deleteUpdateThread = function(messageThreadID){



}

//Add mongoose-auto-increment as a plugin to the project schema
//the plugin adds an project_id(Number) field and will autoincrement 
//when creating a project entity.
messageThreadsSchema.plugin(autoIncrement.plugin, {
    model: 'MessageThreads',
    field: 'messageThread_id',
    startAt: 1000
});

// Create the model for project and expose it to our app
module.exports = mongoose.model('MessageThreads', messageThreadsSchema);
