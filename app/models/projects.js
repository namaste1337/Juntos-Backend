
/////////////////////////
// Modules
/////////////////////////

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

/////////////////////////
// Initializations
/////////////////////////

// Initialize mongoose-auto-increment 
autoIncrement.initialize(mongoose.connection);

/////////////////////////
// Constants
/////////////////////////

//Strings
const LOCATION_TYPE_POINT_STRING              = "Point";
//Errors
const MISSING_LAT_PARAMETER_ERROR_STRING      = "Error: Missing lat parameter";
const MISSING_LNG_PARAMETER_ERROR_STRING      = "Error: Missing lng parameter";
const MISSING_RADIUS_PARAMETER_ERROR_STRING   = "Error: Missing radius parameter";
const MISSING_ID_PARAMETER_ERROR_STRING       = "Error: Missing id parameter";

/////////////////////////
// Schema
/////////////////////////

// Defines the schema for our project collection
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
    location            : {type: Schema.Types.Mixed, loc: {type: {type: String}, coordinates:[Number]}, address: String},
    time                : { type : Date, default: Date.now },
    last_update         : { type : Date, default: Date.now }

});

/////////////////////////
// Indexes
/////////////////////////

// We create an index for the location of a project, 
// this will allow for faster geo spatile queries
projectSchema.index({ "location.loc": '2dsphere' });

/////////////////////////
// Static methods
/////////////////////////

// Removes unneeded fields for the reponse
// Takes a mongoose project entity as a parameter
projectSchema.statics.clean = function(projectEntity){

    var obj = projectEntity.toObject();
    delete obj._id;
    delete obj.__v;

    return obj;

}

/////////////////////////
// Query Helpers
/////////////////////////

// Retrieves projects by max distance relative 
// to longitude and latitude
projectSchema.query.byDistance = function(lat, lng, radius, limit){

    // Validate parameters
    if(lat == null){
        console.error(MISSING_LAT_PARAMETER_ERROR_STRING);
        return;
    }
    if(lng == null){
        console.error(MISSING_LNG_PARAMETER_ERROR_STRING);
        return;
    }
    if(radius == null){
        console.error(MISSING_RADIUS_PARAMETER_ERROR_STRING);
        return;
    }

    let query = {"location.loc":{
        $near: {
            $geometry: {
              type: "Point" ,
              coordinates: [ lng , lat ]
            },
            $maxDistance: radius,
        }
    }}

    return this.find(query).limit(limit);

}

// Retrieves a project by ID
projectSchema.query.byId = function(id){

    // Validate parameters
    if(id == null){
        console.error(MISSING_ID_PARAMETER_ERROR_STRING);
        return;
    }

    let query = {"project_id": id};

    return this.find(query);

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
    this.end_date       = projectObject.end_date;
    this.current_status = projectObject.current_status;
    this.type           = projectObject.type;
    this.food_provided  = projectObject.food_provided;
    this.images         = projectObject.images;
    // Location object the 2dsphere implements
    // geo spatial indexing structure requirements
    this.location       = {
        loc:{
            type: LOCATION_TYPE_POINT_STRING, 
            coordinates:[
                projectObject.location.coordinates.lng,
                projectObject.location.coordinates.lat
            ], 
        },
        address: projectObject.location.address
    };

    this.save((project) => {
        // Return the saved project object
        resolve(this);
    }).catch(error =>{
        console.error(error);
    });

 });

}


//Add mongoose-auto-increment as a plugin to the project schema
//the plugin adds an project_id(Number) field and will autoincrement 
//when creating a project entity.
projectSchema.plugin(autoIncrement.plugin, {
    model: 'Projects',
    field: 'project_id',
    startAt: 1000
});

// Create the model for project and expose it to our app
module.exports = mongoose.model('Projects', projectSchema);
