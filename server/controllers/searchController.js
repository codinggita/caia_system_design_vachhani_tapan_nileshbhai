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
// SEARCH ROUTE #5: Search by design patterns
// METHOD: GET
// ENDPOINT: /api/v1/search/patterns?q=CQRS
// DESCRIPTION: Searches within the patterns_covered metadata field
// ============================================================
const searchByPatterns = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required. Use ?q=your_search_term'
      });
    }

    const regex = new RegExp(q.trim(), 'i');

    const concepts = await Concept.find({
      'metadata.patterns_covered': regex
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
      error: 'Server Error: Unable to search by patterns'
    });
  }
};

// ============================================================
// SEARCH ROUTE #6: Search by language
// METHOD: GET
// ENDPOINT: /api/v1/search/language?q=python
// DESCRIPTION: Searches within the languages metadata field
// ============================================================
const searchByLanguage = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required. Use ?q=your_search_term'
      });
    }

    const regex = new RegExp(q.trim(), 'i');

    const concepts = await Concept.find({
      'metadata.languages': regex
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
      error: 'Server Error: Unable to search by language'
    });
  }
};

// ============================================================
// SEARCH ROUTE #7: Search by category
// METHOD: GET
// ENDPOINT: /api/v1/search/category?q=distributed
// DESCRIPTION: Searches across root-level category and metadata.category
// ============================================================
const searchByCategory = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required. Use ?q=your_search_term'
      });
    }

    const regex = new RegExp(q.trim(), 'i');

    // Search both root-level category and nested metadata.category
    const concepts = await Concept.find({
      $or: [
        { category: regex },
        { 'metadata.category': regex }
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
      error: 'Server Error: Unable to search by category'
    });
  }
};

// ============================================================
// SEARCH ROUTE #8: Search by difficulty
// METHOD: GET
// ENDPOINT: /api/v1/search/difficulty?q=advanced
// DESCRIPTION: Searches across root-level difficulty and metadata.difficulty
// ============================================================
const searchByDifficulty = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required. Use ?q=your_search_term'
      });
    }

    const regex = new RegExp(q.trim(), 'i');

    // Search both root-level difficulty and nested metadata.difficulty
    const concepts = await Concept.find({
      $or: [
        { difficulty: regex },
        { 'metadata.difficulty': regex }
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
      error: 'Server Error: Unable to search by difficulty'
    });
  }
};

// ============================================================
// SEARCH ROUTE #9: Fuzzy search
// METHOD: GET
// ENDPOINT: /api/v1/search/fuzzy?q=kafka
// DESCRIPTION: Performs a fuzzy search across title and content
// ============================================================
const fuzzySearch = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword || keyword.trim() === '') {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const fuzzyRegex = new RegExp(keyword.trim().split("").join(".*"), "i");

        const filter = {
            $or: [
                { prompt: fuzzyRegex },
                { "metadata.concept": fuzzyRegex }
            ]
        };

        const total = await Concept.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this fuzzy search" });
        }

        const results = await Concept.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: Unable to perform fuzzy search" });
    }
};

// ============================================================
// SEARCH ROUTE #10: Autocomplete suggestions
// METHOD: GET
// ENDPOINT: /api/v1/search/autocomplete?q=event
// DESCRIPTION: Returns lightweight suggestions for autocomplete
// ============================================================
const autocompleteSuggestions = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword || keyword.trim() === '') {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const limit = parseInt(req.query.limit) || 5; // Usually 5-10 suggestions is enough

        // Match anywhere in the string
        const regex = new RegExp(keyword.trim(), "i");

        const filter = {
            $or: [
                { title: regex },
                { prompt: regex },
                { "metadata.concept": regex }
            ]
        };

        // Fetch only necessary fields for autocomplete to keep it lightweight
        const results = await Concept.find(filter)
            .select("title prompt category metadata.concept")
            .limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: Unable to fetch autocomplete suggestions" });
    }
};

// ============================================================
// SEARCH ROUTE #11: Recent searches (Recent Concepts)
// METHOD: GET
// ENDPOINT: /api/v1/search/recent
// DESCRIPTION: Fetches the most recently added concepts
// ============================================================
const getRecentSearches = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        const recentSearches = await Concept.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('title prompt category views createdAt');

        res.status(200).json({
            success: true,
            count: recentSearches.length,
            data: recentSearches,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: Unable to fetch recent searches" });
    }
};

// ============================================================
// SEARCH ROUTE #12: Popular searches (Trending Concepts)
// METHOD: GET
// ENDPOINT: /api/v1/search/popular
// DESCRIPTION: Fetches trending concepts based on views
// ============================================================
const getPopularSearches = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        const popularSearches = await Concept.find()
            .sort({ views: -1 }) // Sort by views descending
            .limit(limit)
            .select('title prompt category views createdAt');

        res.status(200).json({
            success: true,
            count: popularSearches.length,
            data: popularSearches,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: Unable to fetch popular searches" });
    }
};

// Helper function to escape regex characters safely
const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// ============================================================
// SEARCH ROUTE #13: Voice optimized search
// METHOD: GET
// ENDPOINT: /api/v1/search/voice?q=load balancing
// DESCRIPTION: Cleans up common voice transcription filler words and searches
// ============================================================
const voiceSearch = async (req, res) => {
    try {
        let { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        // Clean up common filler words from voice search
        const fillers = ['what is', 'how to', 'tell me about', 'explain', 'search for', 'find', 'show me'];
        let cleanedQuery = q.toLowerCase();
        
        fillers.forEach(filler => {
            cleanedQuery = cleanedQuery.replace(new RegExp(`\\b${filler}\\b`, 'gi'), '').trim();
        });

        // If after cleaning it's empty, revert to original
        if (!cleanedQuery) cleanedQuery = q.trim();

        // Split into words and create a flexible regex for voice searches
        const words = cleanedQuery.split(/\s+/).map(escapeRegex);
        const voiceRegex = new RegExp(words.join('.*'), 'i');

        const concepts = await Concept.find({
            $or: [
                { title: voiceRegex },
                { prompt: voiceRegex },
                { 'metadata.concept': voiceRegex },
                { tags: voiceRegex }
            ]
        });

        res.status(200).json({
            success: true,
            count: concepts.length,
            originalQuery: q,
            cleanedQuery: cleanedQuery,
            data: concepts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: Unable to perform voice search" });
    }
};

// ============================================================
// SEARCH ROUTE #14: Exact phrase search
// METHOD: GET
// ENDPOINT: /api/v1/search/exact?q=event sourcing
// DESCRIPTION: Searches for the exact phrase without partial word matching
// ============================================================
const exactSearch = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        // Use word boundaries \b to ensure the exact phrase is matched
        const exactPhraseRegex = new RegExp(`\\b${escapeRegex(q.trim())}\\b`, 'i');

        const concepts = await Concept.find({
            $or: [
                { title: exactPhraseRegex },
                { prompt: exactPhraseRegex },
                { response: exactPhraseRegex },
                { 'metadata.concept': exactPhraseRegex }
            ]
        });

        res.status(200).json({
            success: true,
            count: concepts.length,
            data: concepts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: Unable to perform exact search" });
    }
};

// ============================================================
// SEARCH ROUTE #15: Regex based search
// METHOD: GET
// ENDPOINT: /api/v1/search/regex?pattern=cache
// DESCRIPTION: Allows advanced users to search using standard regex patterns
// ============================================================
const regexSearch = async (req, res) => {
    try {
        const { pattern } = req.query;

        if (!pattern || pattern.trim() === '') {
            return res.status(400).json({ success: false, message: "Query parameter 'pattern' is required" });
        }

        let regex;
        try {
            regex = new RegExp(pattern, 'i');
        } catch (e) {
            return res.status(400).json({ success: false, message: "Invalid regular expression pattern" });
        }

        const concepts = await Concept.find({
            $or: [
                { title: regex },
                { prompt: regex },
                { response: regex }
            ]
        });

        res.status(200).json({
            success: true,
            count: concepts.length,
            data: concepts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: Unable to perform regex search" });
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
  searchByPatterns,
  searchByLanguage,
  searchByCategory,
  searchByDifficulty,
  fuzzySearch,
  autocompleteSuggestions,
  getRecentSearches,
  getPopularSearches,
  voiceSearch,
  exactSearch,
  regexSearch,
};
