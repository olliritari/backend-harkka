const mongoose  = require('mongoose');
var bcrypt    = require('bcrypt-nodejs');
// LUE BCRYPTISTÄ LISÄÄ!

const Schema = mongoose.Schema;

// Create user schema & model 
const UserSchema = new Schema({
  username  : { 
    type: String, 
    unique: true,
    minlength: [4, 'Username does not have enough characters'],
    maxlength: [16, 'Username has too many characters'],
    validate: {
      isAsync: true,
      // Sets up a validator for username format.
      // Timeout for processing over 5 seconds, checks for username to NOT contain any spaces.
      validator: function(value, callback) {
        setTimeout(function() {
          var usernameRegex = /^\S*$/
          var msg = 'Username cannot contain spaces!';
          callback(usernameRegex.test(value), msg);
        }, 5);
      },
      message: 'Default error message'
    },
    // Sets username to be a required field
    required: [true, 'Username required!']
  },
  password: { 
    type: String, 
    minlength: [6, 'Password has to be at least 6 characters.'],
    max: 18,
    validate: {
      isAsync: true,
      validator: function(value, callback) {
        setTimeout(function() {
          var passwordRegex = /^\S*$/
          var msg = 'Password cannot contain spaces!';
          callback(passwordRegex.test(value), msg);
        }, 5);
      },
    },
    // Sets password to be a required field
    required: [true, 'Must have password']
  }
});

// Gets called before user creation, salts the password with bcrypt
UserSchema.pre('save', function(next) {
  var user = this;

    //Override password with hashed password
    user.password = bcrypt.hashSync(user.password);
    next();
});

// Compares the given password at login with the password in the database
UserSchema.methods.isValidPassword = function(sentUserPassword, cb) {
  if(this.password == null) {
    return cb("username not found");
  }
  bcrypt.compare(sentUserPassword, this.password, function(error, isMatch) {
    if(error) return cb("Username not found");
    cb(null, isMatch);
  });
};

const User = mongoose.model('user', UserSchema);

module.exports = User;