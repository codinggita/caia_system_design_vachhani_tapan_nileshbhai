const Concept = require('../models/Concept');

// ============================================================
// ROUTE: Standard pagination
// METHOD: GET
// ENDPOINT: /api/v1/concepts
// ============================================================
const getPaginatedConcepts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Concept.countDocuments();
    const concepts = await Concept.find().skip(startIndex).limit(limit);

    res.status(200).json({
      success: true,
      count: concepts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: concepts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error: Unable to fetch concepts' });
  }
};

// ============================================================
// ROUTE: Cursor pagination
// METHOD: GET
// ENDPOINT: /api/v1/concepts/scroll
// ============================================================
const getScrollConcepts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const cursor = req.query.cursor;

    let query = {};
    if (cursor) {
      query = { _id: { $gt: cursor } };
    }

    const concepts = await Concept.find(query).sort({ _id: 1 }).limit(limit);
    
    const nextCursor = concepts.length > 0 ? concepts[concepts.length - 1]._id : null;

    res.status(200).json({
      success: true,
      count: concepts.length,
      nextCursor,
      data: concepts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error: Unable to fetch concepts via scroll' });
  }
};

// ============================================================
// ROUTE: Infinite scrolling pagination
// METHOD: GET
// ENDPOINT: /api/v1/concepts/infinite
// ============================================================
const getInfiniteConcepts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const concepts = await Concept.find().skip(startIndex).limit(limit);
    
    const total = await Concept.countDocuments();
    const hasMore = startIndex + concepts.length < total;

    res.status(200).json({
      success: true,
      count: concepts.length,
      hasMore,
      page,
      data: concepts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error: Unable to fetch concepts for infinite scrolling' });
  }
};

// ============================================================
// ROUTE: Paginated latest concepts
// METHOD: GET
// ENDPOINT: /api/v1/concepts/latest
// ============================================================
const getPaginatedLatestConcepts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const startIndex = (page - 1) * limit;

    const total = await Concept.countDocuments();
    const concepts = await Concept.find().sort({ createdAt: -1 }).skip(startIndex).limit(limit);

    res.status(200).json({
      success: true,
      count: concepts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: concepts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error: Unable to fetch latest concepts' });
  }
};

// ============================================================
// ROUTE: Paginated trending concepts
// METHOD: GET
// ENDPOINT: /api/v1/concepts/trending
// ============================================================
const getPaginatedTrendingConcepts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Concept.countDocuments();
    const concepts = await Concept.find().sort({ views: -1 }).skip(startIndex).limit(limit);

    res.status(200).json({
      success: true,
      count: concepts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: concepts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error: Unable to fetch trending concepts' });
  }
};

// ============================================================
// ROUTE: Paginated bookmarks
// METHOD: GET
// ENDPOINT: /api/v1/concepts/bookmarks
// ============================================================
const getPaginatedBookmarks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Assuming bookmarks means top bookmarked concepts
    const total = await Concept.countDocuments({ bookmarksCount: { $gt: 0 } });
    const concepts = await Concept.find({ bookmarksCount: { $gt: 0 } })
                                  .sort({ bookmarksCount: -1 })
                                  .skip(startIndex)
                                  .limit(limit);

    res.status(200).json({
      success: true,
      count: concepts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: concepts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error: Unable to fetch bookmarks' });
  }
};

// ============================================================
// ROUTE: Paginated categories
// METHOD: GET
// ENDPOINT: /api/v1/categories
// ============================================================
const getPaginatedCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const categories = await Concept.distinct('metadata.category');
    const total = categories.length;
    
    // Paginate in memory
    const paginatedCategories = categories.slice(startIndex, startIndex + limit);

    res.status(200).json({
      success: true,
      count: paginatedCategories.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: paginatedCategories
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error: Unable to fetch categories' });
  }
};

// ============================================================
// ROUTE: Paginated patterns
// METHOD: GET
// ENDPOINT: /api/v1/patterns
// ============================================================
const getPaginatedPatterns = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const patterns = await Concept.distinct('metadata.patterns_covered');
    const total = patterns.length;
    
    // Paginate in memory
    const paginatedPatterns = patterns.slice(startIndex, startIndex + limit);

    res.status(200).json({
      success: true,
      count: paginatedPatterns.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: paginatedPatterns
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error: Unable to fetch patterns' });
  }
};

// ============================================================
// ROUTE: Paginated search results
// METHOD: GET
// ENDPOINT: /api/v1/search/results
// ============================================================
const getPaginatedSearchResults = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required. Use ?q=your_search_term'
      });
    }

    const regex = new RegExp(q.trim(), 'i');

    const filter = {
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
    };

    const total = await Concept.countDocuments(filter);
    const concepts = await Concept.find(filter).skip(startIndex).limit(limit);

    res.status(200).json({
      success: true,
      count: concepts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      query: q.trim(),
      data: concepts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error: Unable to fetch search results' });
  }
};

module.exports = {
  getPaginatedConcepts,
  getScrollConcepts,
  getInfiniteConcepts,
  getPaginatedLatestConcepts,
  getPaginatedTrendingConcepts,
  getPaginatedBookmarks,
  getPaginatedCategories,
  getPaginatedPatterns,
  getPaginatedSearchResults
};
