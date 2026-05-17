const Concept = require('../models/Concept');

// ============================================================
// ROUTE #1: Fetch all system design concepts
// METHOD: GET
// ENDPOINT: /api/v1/concepts
// ============================================================
const getConcepts = async (req, res) => {
  try {
    const concepts = await Concept.find();

    res.status(200).json({
      success: true,
      count: concepts.length,
      data: concepts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch concepts'
    });
  }
};

// ============================================================
// ROUTE #2: Fetch single concept details
// METHOD: GET
// ENDPOINT: /api/v1/concepts/:id
// ============================================================
const getConcept = async (req, res) => {
  try {
    const concept = await Concept.findById(req.params.id);

    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found'
      });
    }

    res.status(200).json({
      success: true,
      data: concept
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch single concept'
    });
  }
};

// ============================================================
// ROUTE #3: Create new architecture concept
// METHOD: POST
// ENDPOINT: /api/v1/concepts
// ============================================================
const createConcept = async (req, res) => {
  try {
    const concept = await Concept.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Concept created successfully',
      data: concept
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Server Error: Could not create concept'
    });
  }
};

// ============================================================
// ROUTE #4: Replace complete concept
// METHOD: PUT
// ENDPOINT: /api/v1/concepts/:id
// ============================================================
const updateConcept = async (req, res) => {
  try {
    const concept = await Concept.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      overwrite: true
    });

    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Concept replaced successfully',
      data: concept
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error: Could not replace concept'
    });
  }
};

// ============================================================
// ROUTE #5: Update specific concept fields
// METHOD: PATCH
// ENDPOINT: /api/v1/concepts/:id
// ============================================================
const patchConcept = async (req, res) => {
  try {
    const concept = await Concept.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Concept updated successfully',
      data: concept
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error: Could not update concept'
    });
  }
};

// ============================================================
// ROUTE #6: Delete concept record
// METHOD: DELETE
// ENDPOINT: /api/v1/concepts/:id
// ============================================================
const deleteConcept = async (req, res) => {
  try {
    const concept = await Concept.findByIdAndDelete(req.params.id);

    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Concept deleted successfully',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error: Could not delete concept'
    });
  }
};

// ============================================================
// ROUTE #7: Fetch random concept
// METHOD: GET
// ENDPOINT: /api/v1/concepts/random
// ============================================================
const getRandomConcept = async (req, res) => {
  try {
    const concept = await Concept.aggregate([{ $sample: { size: 1 } }]);

    res.status(200).json({
      success: true,
      data: concept[0] || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch random concept'
    });
  }
};

// ============================================================
// ROUTE #8: Fetch latest concepts
// METHOD: GET
// ENDPOINT: /api/v1/concepts/latest
// ============================================================
const getLatestConcepts = async (req, res) => {
  try {
    // Fetches the most recently created concept
    const concepts = await Concept.find().sort({ createdAt: -1 }).limit(1);

    res.status(200).json({
      success: true,
      count: concepts.length,
      data: concepts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch latest concepts'
    });
  }
};

// ============================================================
// ROUTE #9: Fetch trending concepts
// METHOD: GET
// ENDPOINT: /api/v1/concepts/trending
// ============================================================
const getTrendingConcepts = async (req, res) => {
  try {
    // Fetches the most viewed concept
    const concepts = await Concept.find().sort({ views: -1 }).limit(1);

    res.status(200).json({
      success: true,
      count: concepts.length,
      data: concepts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch trending concepts'
    });
  }
};

// ============================================================
// ROUTE #10: Fetch popular concepts
// METHOD: GET
// ENDPOINT: /api/v1/concepts/popular
// ============================================================
const getPopularConcepts = async (req, res) => {
  try {
    // Fetches the most bookmarked concept
    const concepts = await Concept.find().sort({ bookmarksCount: -1 }).limit(1);

    res.status(200).json({
      success: true,
      count: concepts.length,
      data: concepts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch popular concepts'
    });
  }
};

// ============================================================
// ROUTE #11: Fetch concept summary
// METHOD: GET
// ENDPOINT: /api/v1/concepts/:id/summary
// ============================================================
const getConceptSummary = async (req, res) => {
  try {
    // Fetches only basic fields for summary using second-argument projection
    const concept = await Concept.findById(req.params.id, {
      title: 1,
      category: 1,
      subcategory: 1,
      difficulty: 1,
      tags: 1,
      estimatedReadTime: 1
    });

    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found'
      });
    }

    res.status(200).json({
      success: true,
      data: concept
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch concept summary'
    });
  }
};

// ============================================================
// ROUTE #12: Archive concept
// METHOD: PATCH
// ENDPOINT: /api/v1/concepts/:id/archive
// ============================================================
const archiveConcept = async (req, res) => {
  try {
    const concept = await Concept.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );

    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Concept archived successfully',
      data: concept
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to archive concept'
    });
  }
};

// ============================================================
// ROUTE #13: Restore archived concept
// METHOD: PATCH
// ENDPOINT: /api/v1/concepts/:id/restore
// ============================================================
const restoreConcept = async (req, res) => {
  try {
    const concept = await Concept.findByIdAndUpdate(
      req.params.id,
      { isArchived: false },
      { new: true }
    );

    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Concept restored successfully',
      data: concept
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to restore concept'
    });
  }
};

// ============================================================
// ROUTE #14: Fetch related concepts
// METHOD: GET
// ENDPOINT: /api/v1/concepts/:id/related
// ============================================================
const getRelatedConcepts = async (req, res) => {
  try {
    // 1. Get the current concept to find its category and tags
    const concept = await Concept.findById(req.params.id);

    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found'
      });
    }

    const related = await Concept.find({
      _id: { $ne: concept._id },
      $or: [
        { 'metadata.category': concept.metadata?.category },
        { 'metadata.subcategory': concept.metadata?.subcategory }
      ]
    }).limit(10);

    res.status(200).json({
      success: true,
      count: related.length,
      data: related
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch related concepts'
    });
  }
};

// ============================================================
// ROUTE #15: Fetch all unique categories
// METHOD: GET
// ENDPOINT: /api/v1/categories
// ============================================================
const getAllCategories = async (req, res) => {
  try {
    const categories = await Concept.distinct('metadata.category');

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch categories'
    });
  }
};

// ============================================================
// ROUTE #16: Fetch category details (stats)
// METHOD: GET
// ENDPOINT: /api/v1/categories/:category
// ============================================================
const getCategoryDetails = async (req, res) => {
  try {
    const categoryName = req.params.category;

    // Check both locations just in case
    const count = await Concept.countDocuments({
      $or: [
        { 'metadata.category': categoryName },
        { 'category': categoryName }
      ]
    });

    if (count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name: categoryName,
        totalConcepts: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch category details'
    });
  }
};

// ============================================================
// ROUTE #17: Fetch concepts under a category
// METHOD: GET
// ENDPOINT: /api/v1/categories/:category/concepts
// ============================================================
const getConceptsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.category;
    const concepts = await Concept.find({
      $or: [
        { 'metadata.category': categoryName },
        { 'category': categoryName }
      ]
    });

    res.status(200).json({
      success: true,
      count: concepts.length,
      data: concepts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch concepts for this category'
    });
  }
};

// ============================================================
// ROUTE #18: Fetch all unique subcategories
// METHOD: GET
// ENDPOINT: /api/v1/subcategories
// ============================================================
const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Concept.distinct('metadata.subcategory');

    res.status(200).json({
      success: true,
      count: subcategories.length,
      data: subcategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch subcategories'
    });
  }
};

// ============================================================
// ROUTE #19: Fetch all unique tags(concepts)
// METHOD: GET
// ENDPOINT: /api/v1/tags
// ============================================================
const getAllTags = async (req, res) => {
  try {
    const tags = await Concept.distinct('metadata.concept');

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch tags'
    });
  }
};

// ============================================================
// ROUTE #20: Fetch concepts by tag
// METHOD: GET
// ENDPOINT: /api/v1/tags/:tag
// ============================================================
const getConceptsByTag = async (req, res) => {
  try {
    const tagName = req.params.tag;

    const filter = { 'metadata.concept': tagName };

    const total = await Concept.countDocuments(filter);

    if (total === 0) {
      return res.status(404).json({
        success: false,
        message: "No concepts found for this tag",
      });
    }

    const concepts = await Concept.find(filter);

    res.status(200).json({
      success: true,
      count: concepts.length,
      data: concepts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ============================================================
// ROUTE #21: Fetch all unique design patterns
// METHOD: GET
// ENDPOINT: /api/v1/patterns
// ============================================================
const getAllPatterns = async (req, res) => {
  try {
    const patterns = await Concept.distinct('metadata.patterns_covered');

    res.status(200).json({
      success: true,
      count: patterns.length,
      data: patterns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch patterns'
    });
  }
};

// ============================================================
// ROUTE #22: Fetch concepts by design pattern
// METHOD: GET
// ENDPOINT: /api/v1/patterns/:patternName
// ============================================================
const getConceptsByPattern = async (req, res) => {
  try {
    const patternName = req.params.patternName;

    const filter = { 'metadata.patterns_covered': patternName };

    const total = await Concept.countDocuments(filter);

    if (total === 0) {
      return res.status(404).json({
        success: false,
        message: "No concepts found for this pattern",
      });
    }

    const concepts = await Concept.find(filter);

    res.status(200).json({
      success: true,
      count: concepts.length,
      data: concepts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ============================================================
// ROUTE #23: Fetch all unique languages
// METHOD: GET
// ENDPOINT: /api/v1/languages
// ============================================================
const getAllLanguages = async (req, res) => {
  try {
    const languages = await Concept.distinct('metadata.languages');

    res.status(200).json({
      success: true,
      count: languages.length,
      data: languages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch languages'
    });
  }
};

// ============================================================
// ROUTE #24: Fetch concepts by language
// METHOD: GET
// ENDPOINT: /api/v1/languages/:language
// ============================================================
const getConceptsByLanguage = async (req, res) => {
  try {
    // Get the language name from the URL   e.g. /languages/JavaScript
    const languageName = req.params.language;

    // Build filter object
    const filter = { 'metadata.languages': languageName };

    // Count how many documents match
    const total = await Concept.countDocuments(filter);

    // If nothing matches, return 404
    if (total === 0) {
      return res.status(404).json({
        success: false,
        message: "No concepts found for this language",
      });
    }

    // Fetch the matching documents
    const concepts = await Concept.find(filter);

    res.status(200).json({
      success: true,
      count: concepts.length,
      data: concepts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ============================================================
// ROUTE #25: Fetch all unique difficulty levels
// METHOD: GET
// ENDPOINT: /api/v1/difficulty
// ============================================================
const getAllDifficulties = async (req, res) => {
  try {
    const difficulties = await Concept.distinct('metadata.difficulty');

    res.status(200).json({
      success: true,
      count: difficulties.length,
      data: difficulties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ============================================================
// ROUTE #26: Fetch concepts by difficulty
// METHOD: GET
// ENDPOINT: /api/v1/difficulty/:level
// ============================================================
const getConceptsByDifficulty = async (req, res) => {
  try {
    const difficultyLevel = req.params.level;
    const concepts = await Concept.find({ 'metadata.difficulty': difficultyLevel });

    res.status(200).json({
      success: true,
      count: concepts.length,
      data: concepts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ============================================================
// ROUTE #27: Fetch all unique question types
// METHOD: GET
// ENDPOINT: /api/v1/question-type
// ============================================================
const getAllQuestionTypes = async (req, res) => {
  try {
    const types = await Concept.distinct('metadata.question_type');

    res.status(200).json({
      success: true,
      count: types.length,
      data: types
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ============================================================
// ROUTE #28: Fetch concepts by question type
// METHOD: GET
// ENDPOINT: /api/v1/question-type/:type
// ============================================================
const getConceptsByQuestionType = async (req, res) => {
  try {
    const type = req.params.type;
    const concepts = await Concept.find({ 'metadata.question_type': type });

    res.status(200).json({
      success: true,
      count: concepts.length,
      data: concepts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// ============================================================
// EXPORTS
// ============================================================
module.exports = {
  getConcepts,
  getConcept,
  createConcept,
  updateConcept,
  patchConcept,
  deleteConcept,
  getRandomConcept,
  getLatestConcepts,
  getTrendingConcepts,
  getPopularConcepts,
  getConceptSummary,
  archiveConcept,
  restoreConcept,
  getRelatedConcepts,
  getAllCategories,
  getCategoryDetails,
  getConceptsByCategory,
  getAllSubcategories,
  getAllTags,
  getConceptsByTag,
  getAllPatterns,
  getConceptsByPattern,
  getAllLanguages,
  getConceptsByLanguage,
  getAllDifficulties,
  getConceptsByDifficulty,
  getAllQuestionTypes,
  getConceptsByQuestionType,
};
