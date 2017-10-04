// app/models/user.js
// load the things we need
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
    bcrypt   = require('bcrypt-nodejs');

// Initialize mongoose-auto-increment 
autoIncrement.initialize(mongoose.connection);

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        time         : { type : Date, default: Date.now }
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

//Add mongoose-auto-increment as a plugin to the users schema
//the plugin adds an user_id(Number) field and will autoincrement 
//when creating a user entity.
userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'user_id',
    startAt: 1000
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
