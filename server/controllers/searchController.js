const Concept = require('../models/Concept');

// ============================================================
// SEARCH ROUTE #1: Global keyword search
// METHOD: GET
// ENDPOINT: /api/v1/search?q=scaling
// DESCRIPTION: Searches across title, response, tags, category,
//              and metadata fields for matching keywords
// ============================================================
const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    // Validate query parameter
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required. Use ?q=your_search_term'
      });
    }

    // Build case-insensitive regex for flexible matching
    const regex = new RegExp(q.trim(), 'i');

    // Search across multiple fields: title, response, tags, category, and nested metadata
    const concepts = await Concept.find({
      $or: [
        { title: regex },
        { response: regex },
        { prompt: regex },
        { category: regex },
        { subcategory: regex },
        { tags: regex },
        { 'metadata.category': regex },
        { 'metadata.subcategory': regex },
        { 'metadata.concept': regex },
        { 'metadata.difficulty': regex },
        { 'metadata.question_type': regex },
        { 'metadata.languages': regex },
        { 'metadata.patterns_covered': regex }
      ]
    });

    res.status(200).json({
      success: true,
      count: concepts.length,
      query: q.trim(),
      data: concepts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to perform global search'
    });
  }
};

// ============================================================
// SEARCH ROUTE #2: Search inside titles
// METHOD: GET
// ENDPOINT: /api/v1/search/title?q=redis
// DESCRIPTION: Searches only within the title field of concepts
// ============================================================
const searchByTitle = async (req, res) => {
  try {
    const { q } = req.query;

    // Validate query parameter
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required. Use ?q=your_search_term'
      });
    }

    // Build case-insensitive regex for flexible title matching
    const regex = new RegExp(q.trim(), 'i');

    const concepts = await Concept.find({ title: regex });

    res.status(200).json({
      success: true,
      count: concepts.length,
      query: q.trim(),
      data: concepts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to search by title'
    });
  }
};

// ============================================================
// SEARCH ROUTE #3: Search inside responses (content)
// METHOD: GET
// ENDPOINT: /api/v1/search/content?q=database
// DESCRIPTION: Searches only within the response field of concepts
// ============================================================
const searchByContent = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required. Use ?q=your_search_term'
      });
    }

    const regex = new RegExp(q.trim(), 'i');

    const concepts = await Concept.find({ response: regex });

    res.status(200).json({
      success: true,
      count: concepts.length,
      query: q.trim(),
      data: concepts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to search by content'
    });
  }
};

// ============================================================
// SEARCH ROUTE #4: Search using tags
// METHOD: GET
// ENDPOINT: /api/v1/search/tags?q=caching
// DESCRIPTION: Searches within the tags array and metadata.concept
// ============================================================
const searchByTags = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required. Use ?q=your_search_term'
      });
    }

    const regex = new RegExp(q.trim(), 'i');

    // Search in both root-level tags array and metadata.concept
    const concepts = await Concept.find({
      $or: [
        { tags: regex },
        { 'metadata.concept': regex }
      ]
    });

    res.status(200).json({
      success: true,
      count: concepts.length,
      query: q.trim(),
      data: concepts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to search by tags'
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================
module.exports = {
  globalSearch,
  searchByTitle,
  searchByContent,
  searchByTags,
};
