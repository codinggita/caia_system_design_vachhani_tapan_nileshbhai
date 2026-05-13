const Concept = require('../models/Concept');

// ============================================================
// ROUTE #1: Fetch all system design concepts
// METHOD: GET
// ENDPOINT: /api/v1/concepts
// ============================================================
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
      error: 'Server Error: Unable to fetch concepts'
    });
  }
};

// ============================================================
// ROUTE #2: Fetch single concept details
// METHOD: GET
// ENDPOINT: /api/v1/concepts/:id
// ============================================================
exports.getConcept = async (req, res) => {
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
