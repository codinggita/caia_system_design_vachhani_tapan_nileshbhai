const Concept = require('../models/Concept');

// ============================================================
// FILTER ROUTE #1: Filter by category
// METHOD: GET
// ENDPOINT: /api/v1/filter/category?name=Microservices
// ============================================================
const filterByCategory = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ success: false, message: "Query parameter 'name' is required" });

        const regex = new RegExp(`^${name}$`, 'i'); // exact but case-insensitive
        const concepts = await Concept.find({
            $or: [
                { category: regex },
                { 'metadata.category': regex }
            ]
        });

        res.status(200).json({ success: true, count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// FILTER ROUTE #2: Filter by difficulty
// METHOD: GET
// ENDPOINT: /api/v1/filter/difficulty?level=beginner
// ============================================================
const filterByDifficulty = async (req, res) => {
    try {
        const { level } = req.query;
        if (!level) return res.status(400).json({ success: false, message: "Query parameter 'level' is required" });

        const regex = new RegExp(`^${level}$`, 'i');
        const concepts = await Concept.find({
            $or: [
                { difficulty: regex },
                { 'metadata.difficulty': regex }
            ]
        });

        res.status(200).json({ success: true, count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// FILTER ROUTE #3: Filter by pattern
// METHOD: GET
// ENDPOINT: /api/v1/filter/pattern?name=Saga
// ============================================================
const filterByPattern = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ success: false, message: "Query parameter 'name' is required" });

        const regex = new RegExp(name, 'i');
        const concepts = await Concept.find({
            'metadata.patterns_covered': regex
        });

        res.status(200).json({ success: true, count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// FILTER ROUTE #4: Filter by language
// METHOD: GET
// ENDPOINT: /api/v1/filter/language?name=Go
// ============================================================
const filterByLanguage = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ success: false, message: "Query parameter 'name' is required" });

        const regex = new RegExp(`^${name}$`, 'i');
        const concepts = await Concept.find({
            'metadata.languages': regex
        });

        res.status(200).json({ success: true, count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// FILTER ROUTE #5: Filter by date
// METHOD: GET
// ENDPOINT: /api/v1/filter/date?after=2025-01-01
// ============================================================
const filterByDate = async (req, res) => {
    try {
        const { after } = req.query;
        if (!after) return res.status(400).json({ success: false, message: "Query parameter 'after' is required (YYYY-MM-DD)" });

        const date = new Date(after);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid date format. Use YYYY-MM-DD" });
        }

        const concepts = await Concept.find({
            createdAt: { $gte: date }
        });

        res.status(200).json({ success: true, count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// FILTER ROUTE #6: Filter by tags
// METHOD: GET
// ENDPOINT: /api/v1/filter/tags?list=redis,kafka
// ============================================================
const filterByTags = async (req, res) => {
    try {
        const { list } = req.query;
        if (!list) {
            return res.status(400).json({ success: false, message: "Query parameter 'list' is required" });
        }

        const tags = list.split(",").map(tag => new RegExp(tag.trim(), "i"));
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.concept": { $in: tags } };

        const total = await Concept.countDocuments(filter);
        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for these tags" });
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
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// FILTER ROUTE #7: Fetch bookmarked concepts
// METHOD: GET
// ENDPOINT: /api/v1/filter/bookmarks
// ============================================================
const fetchBookmarks = async (req, res) => {
    try {
        // Fetch concepts that have been bookmarked at least once, sorted by most bookmarks
        const concepts = await Concept.find({
            bookmarksCount: { $gt: 0 }
        }).sort({ bookmarksCount: -1 });

        res.status(200).json({ success: true, count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// FILTER ROUTE #8: Fetch trending concepts
// METHOD: GET
// ENDPOINT: /api/v1/filter/trending
// ============================================================
const fetchTrending = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        // Trending can be defined as concepts with high views AND high bookmarks
        const concepts = await Concept.find()
            .sort({ views: -1, bookmarksCount: -1 })
            .limit(limit);

        res.status(200).json({ success: true, count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// FILTER ROUTE #9: Fetch popular concepts
// METHOD: GET
// ENDPOINT: /api/v1/filter/popular
// ============================================================
const fetchPopular = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {}; // no condition, just sorting
        const total = await Concept.countDocuments(filter);
        const results = await Concept.find(filter)
            .sort({ views: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// FILTER ROUTE #10: Fetch unexplored concepts
// METHOD: GET
// ENDPOINT: /api/v1/filter/unexplored
// ============================================================
const fetchUnexplored = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch concepts with 0 or very few views
        const filter = { views: { $lte: 5 } };
        const total = await Concept.countDocuments(filter);
        const results = await Concept.find(filter)
            .sort({ views: 1 }) // sort by lowest views
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// FILTER ROUTE #11: Fetch advanced concepts
// METHOD: GET
// ENDPOINT: /api/v1/filter/expert-only
// ============================================================
const fetchExpertOnly = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const regex = new RegExp('^advanced$', 'i');
        const filter = {
            $or: [
                { difficulty: regex },
                { 'metadata.difficulty': regex }
            ]
        };

        const total = await Concept.countDocuments(filter);
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
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Helper for category-specific fetchers
const fetchByCategoryHelper = async (categoryName, req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const regex = new RegExp(categoryName, 'i');
        const filter = {
            $or: [
                { 'metadata.category': regex },
                { 'metadata.subcategory': regex },
                { 'metadata.concept': regex }
            ]
        };

        const total = await Concept.countDocuments(filter);
        if (total === 0) {
            return res.status(404).json({ success: false, message: `No ${categoryName} concepts found` });
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
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// FILTER ROUTE #12: Fetch frontend system designs
// METHOD: GET
// ENDPOINT: /api/v1/filter/frontend
// ============================================================
const fetchFrontend = (req, res) => fetchByCategoryHelper('frontend', req, res);

// ============================================================
// FILTER ROUTE #13: Fetch backend system designs
// METHOD: GET
// ENDPOINT: /api/v1/filter/backend
// ============================================================
const fetchBackend = (req, res) => fetchByCategoryHelper('backend', req, res);

// ============================================================
// FILTER ROUTE #14: Fetch DevOps concepts
// METHOD: GET
// ENDPOINT: /api/v1/filter/devops
// ============================================================
const fetchDevops = (req, res) => fetchByCategoryHelper('devops', req, res);

// ============================================================
// FILTER ROUTE #15: Fetch cloud architecture concepts
// METHOD: GET
// ENDPOINT: /api/v1/filter/cloud
// ============================================================
const fetchCloud = (req, res) => fetchByCategoryHelper('cloud', req, res);

module.exports = {
    filterByCategory,
    filterByDifficulty,
    filterByPattern,
    filterByLanguage,
    filterByDate,
    filterByTags,
    fetchBookmarks,
    fetchTrending,
    fetchPopular,
    fetchUnexplored,
    fetchExpertOnly,
    fetchFrontend,
    fetchBackend,
    fetchDevops,
    fetchCloud
};
