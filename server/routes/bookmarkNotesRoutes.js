const express = require('express');
const router = express.Router();
const {
    bookmarkConcept,
    removeBookmark,
    fetchAllBookmarks,
    addNote,
    fetchNotes,
    updateNote,
    deleteNote,
    voteOnConcept,
    getTopVotedConcepts
} = require('../controllers/bookmarkNotesController');

// ========================
// BOOKMARK ROUTES
// ========================

// 1. POST /api/v1/bookmarks/:conceptId — Bookmark a concept
router.post('/api/v1/bookmarks/:conceptId', bookmarkConcept);

// 2. DELETE /api/v1/bookmarks/:conceptId — Remove bookmark
router.delete('/api/v1/bookmarks/:conceptId', removeBookmark);

// 3. GET /api/v1/bookmarks — Fetch all bookmarks
router.get('/api/v1/bookmarks', fetchAllBookmarks);

// ========================
// NOTES ROUTES
// ========================

// 4. POST /api/v1/notes/:conceptId — Add notes to a concept
router.post('/api/v1/notes/:conceptId', addNote);

// 5. GET /api/v1/notes/:conceptId — Fetch notes for a concept
router.get('/api/v1/notes/:conceptId', fetchNotes);

// 6. PATCH /api/v1/notes/:noteId — Update a note
router.patch('/api/v1/notes/:noteId', updateNote);

// 7. DELETE /api/v1/notes/:noteId — Delete a note
router.delete('/api/v1/notes/:noteId', deleteNote);

// ========================
// VOTES ROUTES
// ========================

// 8. POST /api/v1/votes/:conceptId — Vote on a concept
router.post('/api/v1/votes/:conceptId', voteOnConcept);

// 9. GET /api/v1/votes/top — Get top voted concepts
router.get('/api/v1/votes/top', getTopVotedConcepts);

module.exports = router;
