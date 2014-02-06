var mongoose = require('mongoose');


module.exports = mongoose.model ('Bill', {
  bill: {type: Number, required: false },
  used: {type: Number, required: false },
  rate: {type: Number, required: false },
  // bdate: {type: String},
  // hsize: {type: Number, required: false },
  // city: {type: String, required: false },
  // zip: {type: Number, required: false },
  // coords: {lat: Number, lng: Number },
  lat: {type: Number, required: false },
  lng: {type: Number, required: false },
  // tstamp: {type: Date, default: Date.now },
  done : Boolean
});