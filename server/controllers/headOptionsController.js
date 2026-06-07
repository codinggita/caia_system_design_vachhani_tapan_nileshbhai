const mongoose = require('mongoose');
const Concept = require('../models/Concept');

// ============================================================
// HEAD REQUEST HANDLERS
// ============================================================

// 1. HEAD /api/v1/concepts
const headConcepts = async (req, res) => {
  try {
    const count = await Concept.countDocuments();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Total-Count', count.toString());
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};

// 2. HEAD /api/v1/concepts/:id
const headConceptById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).end();
    }
    const exists = await Concept.exists({ _id: id });
    if (!exists) {
      return res.status(404).end();
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};

// 3. HEAD /api/v1/concepts/trending
const headConceptsTrending = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 4. HEAD /api/v1/concepts/popular
const headConceptsPopular = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 5. HEAD /api/v1/categories
const headCategories = async (req, res) => {
  try {
    const distinctCategories = await Concept.distinct('metadata.category');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Category-Count', distinctCategories.length.toString());
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};

// 6. HEAD /api/v1/categories/:category/concepts
const headCategoryConcepts = async (req, res) => {
  try {
    const { category } = req.params;
    const count = await Concept.countDocuments({
      $or: [
        { 'metadata.category': category },
        { 'category': category }
      ]
    });
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Total-Count', count.toString());
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};

// 7. HEAD /api/v1/patterns
const headPatterns = async (req, res) => {
  try {
    const distinctPatterns = await Concept.distinct('metadata.patterns_covered');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Pattern-Count', distinctPatterns.length.toString());
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};

// 8. HEAD /api/v1/search
const headSearch = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 9. HEAD /api/v1/search/popular
const headSearchPopular = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 10. HEAD /api/v1/discovery/trending
const headDiscoveryTrending = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 11. HEAD /api/v1/bookmarks
const headBookmarks = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 12. HEAD /api/v1/notes/:conceptId
const headNotes = (req, res) => {
  const { conceptId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(conceptId)) {
    return res.status(400).end();
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 13. HEAD /api/v1/analytics/total-concepts
const headAnalyticsTotalConcepts = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 14. HEAD /api/v1/system/status
const headSystemStatus = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 15. HEAD /api/v1/system/cache/status
const headSystemCacheStatus = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 16. HEAD /api/v1/system/database/status
const headSystemDatabaseStatus = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 17. HEAD /api/v1/system/storage/status
const headSystemStorageStatus = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 18. HEAD /api/v1/auth/profile
const headAuthProfile = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 19. HEAD /api/v1/admin/users
const headAdminUsers = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// 20. HEAD /api/v1/health
const headHealth = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end();
};

// ============================================================
// OPTIONS REQUEST HANDLERS
// ============================================================

// 1. OPTIONS /api/v1/concepts
const optionsConcepts = (req, res) => {
  res.setHeader('Allow', 'GET, POST, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 2. OPTIONS /api/v1/concepts/:id
const optionsConceptById = (req, res) => {
  res.setHeader('Allow', 'GET, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 3. OPTIONS /api/v1/categories
const optionsCategories = (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 4. OPTIONS /api/v1/patterns
const optionsPatterns = (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 5. OPTIONS /api/v1/search
const optionsSearch = (req, res) => {
  res.setHeader('Allow', 'GET, POST, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 6. OPTIONS /api/v1/filter/category
const optionsFilterCategory = (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 7. OPTIONS /api/v1/discovery/trending
const optionsDiscoveryTrending = (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 8. OPTIONS /api/v1/bookmarks/:conceptId
const optionsBookmarksById = (req, res) => {
  res.setHeader('Allow', 'POST, DELETE, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 9. OPTIONS /api/v1/notes/:conceptId
const optionsNotesById = (req, res) => {
  res.setHeader('Allow', 'GET, POST, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 10. OPTIONS /api/v1/auth/login
const optionsAuthLogin = (req, res) => {
  res.setHeader('Allow', 'POST, OPTIONS');
  res.sendStatus(204);
};

// 11. OPTIONS /api/v1/auth/register
const optionsAuthRegister = (req, res) => {
  res.setHeader('Allow', 'POST, OPTIONS');
  res.sendStatus(204);
};

// 12. OPTIONS /api/v1/admin/users
const optionsAdminUsers = (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 13. OPTIONS /api/v1/admin/system/health
const optionsAdminSystemHealth = (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 14. OPTIONS /api/v1/analytics/total-concepts
const optionsAnalyticsTotalConcepts = (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 15. OPTIONS /api/v1/system/status
const optionsSystemStatus = (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 16. OPTIONS /api/v1/system/reindex
const optionsSystemReindex = (req, res) => {
  res.setHeader('Allow', 'POST, OPTIONS');
  res.sendStatus(204);
};

// 17. OPTIONS /api/v1/system/restart
const optionsSystemRestart = (req, res) => {
  res.setHeader('Allow', 'POST, OPTIONS');
  res.sendStatus(204);
};

// 18. OPTIONS /api/v1/validate/concept
const optionsValidateConcept = (req, res) => {
  res.setHeader('Allow', 'POST, OPTIONS');
  res.sendStatus(204);
};

// 19. OPTIONS /api/v1/errors/not-found
const optionsErrorsNotFound = (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS, HEAD');
  res.sendStatus(204);
};

// 20. OPTIONS /api/v1/health
const optionsHealth = (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS, HEAD');
  res.sendStatus(204);
};

module.exports = {
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
};
