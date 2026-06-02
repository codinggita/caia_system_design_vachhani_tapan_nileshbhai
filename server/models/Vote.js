const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
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
  value: {
    type: Number,
    enum: [1, -1],
    default: 1
  }
}, {
  timestamps: true,
  collection: 'votes'
});

// Ensure a user can only vote once per concept
VoteSchema.index({ conceptId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
