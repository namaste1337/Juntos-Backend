
/////////////////////////
// Modules
/////////////////////////

// app/models/user.js
// load the things we need
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

// Initialize mongoose-auto-increment 
autoIncrement.initialize(mongoose.connection);

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
    images              : Schema.Types.Mixed,
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

    var obj = projectEntity.toObject();
    delete obj._id;
    delete obj.__v;

    return obj;

}

// Handles retrieving projects by id
projectSchema.statics.getProjectsById = function(id){

   return new Promise((resolve, reject) => {
        if(id !== null){
            reject("Error: Missing id parameter");
        }

        let query = {"project_id": id};

        this.find(query, (error, projects) => {
            if(error)
                reject(error);
            reoslve(projects);
        });

    })

}


/////////////////////////
// Instance methods
/////////////////////////

// Handles creating a new project
projectSchema.methods.createProject = function(projectObject){
 
 return new Promise((resolve, reject) => {

    this.user           = projectObject.user;
    this.name           = projectObject.name;
    this.description    = projectObject.description;
    this.start_date     = projectObject.start_date;
    this.end_date       = projectObject.end_start;
    this.current_status = projectObject.current_status;
    this.type           = projectObject.type;
    this.food_provided  = projectObject.food_provided;
    this.images         = projectObject.images;
    this.location       = projectObject.location;

    this.save((error) => {
        if(error)
            reject(error);
        // Return the saved project object
        resolve(this);
    });

 });

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
