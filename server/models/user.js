const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT = 10;

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 40
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 40
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  },
  messages: {
    type: Array,
    default: []
  }
});

// Check if password is being set or modified - if so, then hash password
// using es5 to ensure functionality
userSchema.pre("save", function(next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(SALT, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
