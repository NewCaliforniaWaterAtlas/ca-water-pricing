var mongoose = require('mongoose');

module.exports = mongoose.model ('Agency', {
  agency: {type: String, required: false },
  lat: {type: Number, required: false },
  lng: {type: Number, required: false },
  done : Boolean
}, 'agency');