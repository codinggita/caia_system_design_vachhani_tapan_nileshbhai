const express = require('express');
const router = express.Router();
const {
    bulkCreateConcepts,
    bulkUpdateConcepts,
    bulkDeleteConcepts,
    bulkArchiveConcepts,
    bulkRestoreConcepts
} = require('../controllers/bulkController');

// 1. POST /api/v1/concepts/bulk/create — Bulk create concepts
router.post('/api/v1/concepts/bulk/create', bulkCreateConcepts);

// 2. PATCH /api/v1/concepts/bulk/update — Bulk update concepts
router.patch('/api/v1/concepts/bulk/update', bulkUpdateConcepts);

// 3. DELETE /api/v1/concepts/bulk/delete — Bulk delete concepts
router.delete('/api/v1/concepts/bulk/delete', bulkDeleteConcepts);

// 4. PATCH /api/v1/concepts/bulk/archive — Bulk archive concepts
router.patch('/api/v1/concepts/bulk/archive', bulkArchiveConcepts);

// 5. PATCH /api/v1/concepts/bulk/restore — Bulk restore concepts
router.patch('/api/v1/concepts/bulk/restore', bulkRestoreConcepts);

module.exports = router;
