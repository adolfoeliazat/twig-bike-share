var mongoose = require("mongoose");
var BikeSchema = new mongoose.Schema({
  bikeId: Number,
  code: String
});

BikeSchema.statics.findByBikeId = function (bikeId, callback) {
  return this.findOne({ 'bikeId': bikeId }, function (err, bike) {
    if (err) {
      console.log(err);
    } else {
      callback(bike);
    }
  });
};

module.exports = mongoose.model("Bike", BikeSchema);
