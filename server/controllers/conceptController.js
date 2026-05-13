const Concept = require('../models/Concept');

// @desc    Fetch all system design concepts
// @route   GET /api/v1/concepts
// @access  Public
exports.getConcepts = async (req, res) => {
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
      error: 'Server Error'
    });
  }
};
