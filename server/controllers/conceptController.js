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
    // Fetches one recently created concept
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
  getLatestConcepts
};
