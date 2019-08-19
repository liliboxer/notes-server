const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50
  },
  body: {
    type: String,
    required: true,
    maxlength: 120
  }
}, { 
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  } 
});

module.exports = mongoose.model('Note', noteSchema);
