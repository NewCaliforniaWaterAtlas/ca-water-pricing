var mongoose = require('mongoose');

module.exports = mongoose.model ('Agency', {
  agency: {type: String, required: false },
  lat: {type: Number, required: false },
  lng: {type: Number, required: false },
  quantity_rate: {type: Number, required: false },
  service_charge: {type: Number, required: false },
  flat_rate: {type: Number, required: false },
  done : Boolean
}, 'agency');