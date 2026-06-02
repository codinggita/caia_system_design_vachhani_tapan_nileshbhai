const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
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
  }
}, {
  timestamps: true,
  collection: 'bookmarks'
});

// Ensure a user can only bookmark a concept once
BookmarkSchema.index({ conceptId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
