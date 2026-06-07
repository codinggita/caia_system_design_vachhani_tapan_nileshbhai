const express = require('express');
const router = express.Router();

const {
  headConcepts,
  headConceptById,
  headConceptsTrending,
  headConceptsPopular,
  headCategories,
  headCategoryConcepts,
  headPatterns,
  headSearch,
  headSearchPopular,
  headDiscoveryTrending,
  headBookmarks,
  headNotes,
  headAnalyticsTotalConcepts,
  headSystemStatus,
  headSystemCacheStatus,
  headSystemDatabaseStatus,
  headSystemStorageStatus,
  headAuthProfile,
  headAdminUsers,
  headHealth,

  optionsConcepts,
  optionsConceptById,
  optionsCategories,
  optionsPatterns,
  optionsSearch,
  optionsFilterCategory,
  optionsDiscoveryTrending,
  optionsBookmarksById,
  optionsNotesById,
  optionsAuthLogin,
  optionsAuthRegister,
  optionsAdminUsers,
  optionsAdminSystemHealth,
  optionsAnalyticsTotalConcepts,
  optionsSystemStatus,
  optionsSystemReindex,
  optionsSystemRestart,
  optionsValidateConcept,
  optionsErrorsNotFound,
  optionsHealth
} = require('../controllers/headOptionsController');

// ============================================================
// HEAD ROUTES
// ============================================================

router.head('/api/v1/concepts', headConcepts);
router.head('/api/v1/concepts/trending', headConceptsTrending);
router.head('/api/v1/concepts/popular', headConceptsPopular);
router.head('/api/v1/concepts/:id', headConceptById);
router.head('/api/v1/categories', headCategories);
router.head('/api/v1/categories/:category/concepts', headCategoryConcepts);
router.head('/api/v1/patterns', headPatterns);
router.head('/api/v1/search/popular', headSearchPopular); // Must be registered before :id or general search if needed, but in single file we order carefully
router.head('/api/v1/search', headSearch);
router.head('/api/v1/discovery/trending', headDiscoveryTrending);
router.head('/api/v1/bookmarks', headBookmarks);
router.head('/api/v1/notes/:conceptId', headNotes);
router.head('/api/v1/analytics/total-concepts', headAnalyticsTotalConcepts);
router.head('/api/v1/system/cache/status', headSystemCacheStatus);
router.head('/api/v1/system/database/status', headSystemDatabaseStatus);
router.head('/api/v1/system/storage/status', headSystemStorageStatus);
router.head('/api/v1/system/status', headSystemStatus);
router.head('/api/v1/auth/profile', headAuthProfile);
router.head('/api/v1/admin/users', headAdminUsers);
router.head('/api/v1/health', headHealth);

// ============================================================
// OPTIONS ROUTES
// ============================================================

router.options('/api/v1/concepts', optionsConcepts);
router.options('/api/v1/concepts/:id', optionsConceptById);
router.options('/api/v1/categories', optionsCategories);
router.options('/api/v1/patterns', optionsPatterns);
router.options('/api/v1/search', optionsSearch);
router.options('/api/v1/filter/category', optionsFilterCategory);
router.options('/api/v1/discovery/trending', optionsDiscoveryTrending);
router.options('/api/v1/bookmarks/:conceptId', optionsBookmarksById);
router.options('/api/v1/notes/:conceptId', optionsNotesById);
router.options('/api/v1/auth/login', optionsAuthLogin);
router.options('/api/v1/auth/register', optionsAuthRegister);
router.options('/api/v1/admin/users', optionsAdminUsers);
router.options('/api/v1/admin/system/health', optionsAdminSystemHealth);
router.options('/api/v1/analytics/total-concepts', optionsAnalyticsTotalConcepts);
router.options('/api/v1/system/status', optionsSystemStatus);
router.options('/api/v1/system/reindex', optionsSystemReindex);
router.options('/api/v1/system/restart', optionsSystemRestart);
router.options('/api/v1/validate/concept', optionsValidateConcept);
router.options('/api/v1/errors/not-found', optionsErrorsNotFound);
router.options('/api/v1/health', optionsHealth);

module.exports = router;
