var mongoose = require('mongoose');

var regex2 = [/^[a-zA-Z ]+$/]; // alpha numeric chars and spaces
//var regex3 = [/^(?:(?:(?:0?[13578]|1[02])(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2])(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:0?2(\/|-|\.)29\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9])|(?:1[0-2]))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/]; // date formats

var billType = 'frate mrate'.split(' ');
var unitType = 'gal ccf'.split(' ');

module.exports = mongoose.model ('Bill', {
  addr: {type: String, required: true },
  hsize: {type: Number, min: 1, max: 12, required: true },
  util: {type: String, match: regex2, required: true },
  bill: {type: Number, required: true },
  sdate: {type: Date, required: true },
  edate: {type: Date, required: true },
  billtype: {type: String, enum: billType, required: true},  
  used: {type: Number, required: false },  
  units: {type: String, enum: unitType, required: false},
  lat: {type: Number, required: true },
  lng: {type: Number, required: true },
  rate: {type: Number, required: false, default: 3},
  tstamp: { type : Date, default: Date.now },
  // coords: {lat: Number, lng: Number },
  done : Boolean
});