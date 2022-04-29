//we create mongoose to communicate to mongoDB
const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  RollNumber: String,
  Time: String,
  Type: Number,
  facultyId: String,
  Name: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
