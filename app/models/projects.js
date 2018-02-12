
/////////////////////////
// Modules
/////////////////////////

// app/models/user.js
// load the things we need
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
    bcrypt   = require('bcrypt-nodejs'),
    user     = require('user'),

// Initialize mongoose-auto-increment 
autoIncrement.initialize(mongoose.connection);


/////////////////////////
// Constants
/////////////////////////

// Objects
const NULL_OBJECT = null;
// Strings
const EMPTY_STRING = "";


/////////////////////////
// Schema
/////////////////////////

// define the schema for our user model
var projectSchema = mongoose.Schema({

    user                : Schema.Types.Mixed,
    name                : String,
    description         : String,
    start_date          : String,
    end_date            : String,
    current_status      : String,
    type                : String,
    food_provided       : String,
    images              : [String]
    location            : Schema.Types.Mixed,
    time                : { type : Date, default: Date.now },
    last_update         : { type : Date, default: Date.now }
    

});

/////////////////////////
// Static methods
/////////////////////////

// Removes fields not required for the reponse
// Takes a mongoose project entity as a parameter
projectSchema.statics.clean = function(projectEntity){

    // TODO: The following is a place holder.
    // var obj = projectEntity.toObject();
    // delete obj.local.password;
    // delete obj._id;
    // delete obj.__v;

    // return obj;
}

/////////////////////////
// Instance method
/////////////////////////

projectSchema.newProject(projectObject){
 
    let errorProjectParams = this_validateProjectParms(projectObject)
    // If any project values are missing or incorrect return them
    // to controller.
    if(errorProjectParams.length > 0)
        return errorProjectParams;



}


//Add mongoose-auto-increment as a plugin to the users schema
//the plugin adds an user_id(Number) field and will autoincrement 
//when creating a user entity.
projectSchema.plugin(autoIncrement.plugin, {
    model: 'Projects',
    field: 'project_id',
    startAt: 1000
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Projects', projectSchema);
