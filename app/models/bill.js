var mongoose = require('mongoose');


module.exports = mongoose.model ('Bill', {
  addr: {type: String, required: false },
  hsize: {type: Number, required: false },
  util: {type: String, required: false },
  bill: {type: Number, required: false },
  sdate: {type: String, required: false },
  edate: {type: String, required: false },  
  used: {type: Number, required: false },  
  units: {type: String, required: false},
  lat: {type: Number, required: false },
  lng: {type: Number, required: false },
  rate: {type: Number, required: false},
  // zip: {type: Number, required: false },
  // coords: {lat: Number, lng: Number },
  tstamp: { type : Date, default: Date.now },
  done : Boolean
});