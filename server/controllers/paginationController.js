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

module.exports = {
  getPaginatedConcepts,
  getScrollConcepts,
  getInfiniteConcepts,
  getPaginatedLatestConcepts,
  getPaginatedTrendingConcepts
};
