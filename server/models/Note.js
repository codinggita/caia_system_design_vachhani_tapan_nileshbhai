const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  conceptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Concept',
    required: [true, 'Please provide a concept ID'],
    index: true
  },
  userId: {
    type: String,
    default: 'anonymous',
    index: true
  },
  content: {
    type: String,
    required: [true, 'Please add note content']
  },
  title: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'notes'
});

module.exports = mongoose.model('Note', NoteSchema);
