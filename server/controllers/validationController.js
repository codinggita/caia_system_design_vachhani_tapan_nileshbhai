const mongoose = require('mongoose');

// ============================================================
// 1. VALIDATE ROUTE: Validate concept payload
// METHOD: POST | ENDPOINT: /api/v1/validate/concept
// ============================================================
const validateConcept = (req, res) => {
  const { title, prompt, response, category, subcategory, questionType, difficulty, tags } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('Title is required and must be a non-empty string');
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    errors.push('Prompt is required and must be a non-empty string');
  }

  if (!response || typeof response !== 'string' || response.trim() === '') {
    errors.push('Response is required and must be a non-empty string');
  }

  if (category !== undefined && (typeof category !== 'string' || category.trim() === '')) {
    errors.push('Category must be a non-empty string if provided');
  }

  if (subcategory !== undefined && (typeof subcategory !== 'string' || subcategory.trim() === '')) {
    errors.push('Subcategory must be a non-empty string if provided');
  }

  const allowedQuestionTypes = ['design', 'theory', 'practical'];
  if (questionType !== undefined && !allowedQuestionTypes.includes(questionType)) {
    errors.push(`Question type must be one of: ${allowedQuestionTypes.join(', ')}`);
  }

  const allowedDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
  if (difficulty !== undefined && !allowedDifficulties.includes(difficulty)) {
    errors.push(`Difficulty must be one of: ${allowedDifficulties.join(', ')}`);
  }

  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      errors.push('Tags must be an array of strings');
    } else {
      tags.forEach((tag, idx) => {
        if (typeof tag !== 'string' || tag.trim() === '') {
          errors.push(`Tag at index ${idx} must be a non-empty string`);
        }
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors
    });
  }

  res.status(200).json({
    success: true,
    message: 'Concept payload is valid',
    data: {
      title,
      prompt,
      response,
      category,
      subcategory,
      questionType,
      difficulty,
      tags
    }
  });
};

// ============================================================
// 2. VALIDATE ROUTE: Validate update payload
// METHOD: PATCH | ENDPOINT: /api/v1/validate/concept/:id
// ============================================================
const validateConceptUpdate = (req, res) => {
  const { id } = req.params;
  const errors = [];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    errors.push('Invalid concept ID format');
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    errors.push('Request body cannot be empty for an update');
  }

  const { title, prompt, response, category, subcategory, questionType, difficulty, tags } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    errors.push('Title must be a non-empty string');
  }

  if (prompt !== undefined && (typeof prompt !== 'string' || prompt.trim() === '')) {
    errors.push('Prompt must be a non-empty string');
  }

  if (response !== undefined && (typeof response !== 'string' || response.trim() === '')) {
    errors.push('Response must be a non-empty string');
  }

  if (category !== undefined && (typeof category !== 'string' || category.trim() === '')) {
    errors.push('Category must be a non-empty string');
  }

  if (subcategory !== undefined && (typeof subcategory !== 'string' || subcategory.trim() === '')) {
    errors.push('Subcategory must be a non-empty string');
  }

  const allowedQuestionTypes = ['design', 'theory', 'practical'];
  if (questionType !== undefined && !allowedQuestionTypes.includes(questionType)) {
    errors.push(`Question type must be one of: ${allowedQuestionTypes.join(', ')}`);
  }

  const allowedDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
  if (difficulty !== undefined && !allowedDifficulties.includes(difficulty)) {
    errors.push(`Difficulty must be one of: ${allowedDifficulties.join(', ')}`);
  }

  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      errors.push('Tags must be an array of strings');
    } else {
      tags.forEach((tag, idx) => {
        if (typeof tag !== 'string' || tag.trim() === '') {
          errors.push(`Tag at index ${idx} must be a non-empty string`);
        }
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors
    });
  }

  res.status(200).json({
    success: true,
    message: 'Update payload is valid',
    conceptId: id,
    data: req.body
  });
};

// ============================================================
// 3. VALIDATE ROUTE: Validate search payload
// METHOD: POST | ENDPOINT: /api/v1/validate/search
// ============================================================
const validateSearch = (req, res) => {
  const { query, q, page, limit, type } = req.body;
  const errors = [];

  const searchQuery = query || q;

  if (searchQuery === undefined || searchQuery === null) {
    errors.push('Search query is required under key "query" or "q"');
  } else if (typeof searchQuery !== 'string' || searchQuery.trim() === '') {
    errors.push('Search query must be a non-empty string');
  }

  if (page !== undefined) {
    const pageNum = Number(page);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      errors.push('Page must be a positive integer starting from 1');
    }
  }

  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be an integer between 1 and 100');
    }
  }

  const allowedSearchTypes = [
    'global', 'title', 'content', 'tags', 'patterns', 'language',
    'category', 'difficulty', 'fuzzy', 'exact', 'regex', 'voice', 'autocomplete'
  ];
  if (type !== undefined && !allowedSearchTypes.includes(type)) {
    errors.push(`Search type must be one of: ${allowedSearchTypes.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors
    });
  }

  res.status(200).json({
    success: true,
    message: 'Search payload is valid',
    data: {
      query: searchQuery.trim(),
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      type: type || 'global'
    }
  });
};

// ============================================================
// 4. VALIDATE ROUTE: Validate tags
// METHOD: POST | ENDPOINT: /api/v1/validate/tags
// ============================================================
const validateTags = (req, res) => {
  const { tags } = req.body;
  const errors = [];

  if (tags === undefined || tags === null) {
    errors.push('Tags array is required under key "tags"');
  } else if (!Array.isArray(tags)) {
    errors.push('Tags must be a JSON array');
  } else if (tags.length === 0) {
    errors.push('Tags array cannot be empty');
  } else {
    tags.forEach((tag, idx) => {
      if (typeof tag !== 'string' || tag.trim() === '') {
        errors.push(`Tag at index ${idx} must be a non-empty string`);
      } else if (tag.length > 30) {
        errors.push(`Tag "${tag}" at index ${idx} exceeds the limit of 30 characters`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors
    });
  }

  res.status(200).json({
    success: true,
    message: 'Tags payload is valid',
    data: {
      tags: tags.map(tag => tag.trim())
    }
  });
};

// ============================================================
// 5. VALIDATE ROUTE: Validate uploads
// METHOD: POST | ENDPOINT: /api/v1/validate/upload
// ============================================================
const validateUpload = (req, res) => {
  const { fileName, fileSize, mimeType } = req.body;
  const errors = [];

  if (!fileName || typeof fileName !== 'string' || fileName.trim() === '') {
    errors.push('fileName is required and must be a non-empty string');
  }

  if (fileSize === undefined || fileSize === null) {
    errors.push('fileSize is required');
  } else if (typeof fileSize !== 'number' || fileSize <= 0) {
    errors.push('fileSize must be a positive number representing bytes');
  } else if (fileSize > 10 * 1024 * 1024) { // 10MB limit
    errors.push('fileSize exceeds the maximum allowed limit of 10MB (10,485,760 bytes)');
  }

  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'text/markdown', 'application/json'
  ];

  if (!mimeType || typeof mimeType !== 'string' || mimeType.trim() === '') {
    errors.push('mimeType is required and must be a non-empty string');
  } else if (!allowedMimeTypes.includes(mimeType)) {
    errors.push(`mimeType "${mimeType}" is not allowed. Allowed types are: ${allowedMimeTypes.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors
    });
  }

  res.status(200).json({
    success: true,
    message: 'Upload metadata is valid',
    data: {
      fileName,
      fileSize,
      mimeType
    }
  });
};

// ============================================================
// 6. ERROR ROUTE: Simulate 404 error
// METHOD: GET | ENDPOINT: /api/v1/errors/not-found
// ============================================================
const simulateNotFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'Simulated 404: The requested resource could not be found.'
  });
};

// ============================================================
// 7. ERROR ROUTE: Simulate 500 error
// METHOD: GET | ENDPOINT: /api/v1/errors/server-error
// ============================================================
const simulateServerError = (req, res) => {
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'Simulated 500: An unexpected internal server error occurred.'
  });
};

// ============================================================
// 8. ERROR ROUTE: Simulate DB error
// METHOD: GET | ENDPOINT: /api/v1/errors/database
// ============================================================
const simulateDatabaseError = (req, res) => {
  res.status(500).json({
    success: false,
    error: 'DatabaseError',
    message: 'Simulated DB Error: MongoNetworkError: connection timed out',
    code: 10004
  });
};

// ============================================================
// 9. ERROR ROUTE: Simulate validation error
// METHOD: GET | ENDPOINT: /api/v1/errors/validation
// ============================================================
const simulateValidationError = (req, res) => {
  res.status(400).json({
    success: false,
    error: 'ValidationError',
    message: 'Simulated validation failure',
    errors: [
      'Path `title` is required.',
      'Path `prompt` is required.',
      'Path `difficulty` is required.'
    ]
  });
};

// ============================================================
// 10. ERROR ROUTE: Simulate JWT expiry
// METHOD: GET | ENDPOINT: /api/v1/errors/token-expired
// ============================================================
const simulateTokenExpired = (req, res) => {
  res.status(401).json({
    success: false,
    error: 'TokenExpiredError',
    message: 'Simulated Error: jwt expired',
    expiredAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 mins ago
  });
};

module.exports = {
  validateConcept,
  validateConceptUpdate,
  validateSearch,
  validateTags,
  validateUpload,
  simulateNotFound,
  simulateServerError,
  simulateDatabaseError,
  simulateValidationError,
  simulateTokenExpired
};
