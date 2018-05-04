
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

/////////////////////////
// Schema
/////////////////////////

// Defines the schema for our messages collection
var messageThreadsSchema = mongoose.Schema({

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

/////////////////////////
// Query Helpers
/////////////////////////


/////////////////////////
// Instance methods
/////////////////////////

/**
 * Description: Creates a new message thread
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


    console.log("Before");
    // Create new messsage thread
    this.save((message) => {
        console.log("Message Saved");
        resolve(this);
    }).catch(error =>{
        console.trace(error);
    });

 });

}


messageThreadsSchema.methods.getMessageThread = function(messageThreadID){


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

messageThreadsSchema.methods.updateMessageThread = function(messageObject){



}

messageThreadsSchema.methods.deleteUpdateThread = function(messageThreadID){



}

//Add mongoose-auto-increment as a plugin to the project schema
//the plugin adds an project_id(Number) field and will autoincrement 
//when creating a project entity.
messageThreadsSchema.plugin(autoIncrement.plugin, {
    model: 'MessageThreads',
    field: '"messageThread_id"',
    startAt: 1000
});

// Create the model for project and expose it to our app
module.exports = mongoose.model('MessageThreads', messageThreadsSchema);
