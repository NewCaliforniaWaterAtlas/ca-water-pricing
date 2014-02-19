var mongoose = require('mongoose');


module.exports = mongoose.model ('Bill', {
  bill: {type: Number, required: false },
  used: {type: Number, required: false },  
  bdate: {type: Number, required: false},
  hsize: {type: Number, required: false },
  rate: {type: Number, required: false },
  zip: {type: Number, required: false },
  // zip: {type: Number, required: false },
  // coords: {lat: Number, lng: Number },
  lng: {type: Number, required: false },
  lat: {type: Number, required: false },
  tstamp: { type : Date, default: Date.now },
  done : Boolean
});