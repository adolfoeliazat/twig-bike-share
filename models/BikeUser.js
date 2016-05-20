var mongoose = require("mongoose");
var BikeUserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String
});

module.exports = mongoose.model("BikeUser", BikeUserSchema);