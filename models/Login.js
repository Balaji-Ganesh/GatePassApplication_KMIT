//creating teacher collection

const mongoose = require("mongoose");

const TeacherDetails = mongoose.Schema({
  Name: String,
  Password: String,
  role: String,
  uniqueId: String,
});

const Details = mongoose.model("Details", TeacherDetails);

module.exports = Details;
