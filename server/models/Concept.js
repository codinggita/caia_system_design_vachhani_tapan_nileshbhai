const mongoose = require('mongoose');

const ConceptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    index: true
  },
  prompt: {
    type: String,
    required: [true, 'Please add a prompt']
  },
  response: {
    type: String,
    required: [true, 'Please add a response']
  },
  category: {
    type: String,
    index: true
  },
  metadata: {
    type: Object,
    default: {}
  },
  subcategory: {
    type: String
  },
  questionType: {
    type: String,
    enum: ['design', 'theory', 'practical']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    index: true
  },
  tags: [{
    type: String,
    index: true
  }],
  views: {
    type: Number,
    default: 0
  },
  bookmarksCount: {
    type: Number,
    default: 0
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  versionHistory: [{
    version: Number,
    content: String,
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: 'data'
});

module.exports = mongoose.model('Concept', ConceptSchema);
