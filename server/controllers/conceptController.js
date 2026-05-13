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

// ============================================================
// ROUTE #3: Create new architecture concept
// METHOD: POST
// ENDPOINT: /api/v1/concepts
// ============================================================
exports.createConcept = async (req, res) => {
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
exports.updateConcept = async (req, res) => {
  try {
    const concept = await Concept.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      overwrite: true // This ensures a complete replacement of the document
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
