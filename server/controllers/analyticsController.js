const Concept = require('../models/Concept');

// ============================================================
// ANALYTICS ROUTE #1: Total concepts count
// METHOD: GET
// ENDPOINT: /api/v1/analytics/total-concepts
// ============================================================
const getTotalConcepts = async (req, res) => {
    try {
        const total = await Concept.countDocuments();
        res.status(200).json({
            success: true,
            data: {
                total
            }
        });
    } catch (error) {
        console.error("Error in getTotalConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ANALYTICS ROUTE #2: Category distribution
// METHOD: GET
// ENDPOINT: /api/v1/analytics/category-distribution
// ============================================================
const getCategoryDistribution = async (req, res) => {
    try {
        const distribution = await Concept.aggregate([
            {
                $group: {
                    _id: { $ifNull: ["$category", "$metadata.category"] },
                    count: { $sum: 1 }
                }
            },
            { $match: { _id: { $ne: null } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: distribution
        });
    } catch (error) {
        console.error("Error in getCategoryDistribution:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ANALYTICS ROUTE #3: Difficulty analytics
// METHOD: GET
// ENDPOINT: /api/v1/analytics/difficulty-stats
// ============================================================
const getDifficultyStats = async (req, res) => {
    try {
        const stats = await Concept.aggregate([
            {
                $group: {
                    _id: { $ifNull: ["$difficulty", "$metadata.difficulty"] },
                    count: { $sum: 1 }
                }
            },
            { $match: { _id: { $ne: null } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error("Error in getDifficultyStats:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ANALYTICS ROUTE #4: Top patterns
// METHOD: GET
// ENDPOINT: /api/v1/analytics/patterns/top
// ============================================================
const getTopPatterns = async (req, res) => {
    try {
        const topPatterns = await Concept.aggregate([
            {
                $unwind: {
                    path: "$metadata.patterns_covered",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $group: {
                    _id: "$metadata.patterns_covered",
                    count: { $sum: 1 }
                }
            },
            { $match: { _id: { $ne: null }, _id: { $ne: "" } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            success: true,
            data: topPatterns
        });
    } catch (error) {
        console.error("Error in getTopPatterns:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ANALYTICS ROUTE #5: Top languages
// METHOD: GET
// ENDPOINT: /api/v1/analytics/languages/top
// ============================================================
const getTopLanguages = async (req, res) => {
    try {
        const topLanguages = await Concept.aggregate([
            {
                $unwind: {
                    path: "$metadata.languages",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $group: {
                    _id: "$metadata.languages",
                    count: { $sum: 1 }
                }
            },
            { $match: { _id: { $ne: null }, _id: { $ne: "" } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            success: true,
            data: topLanguages
        });
    } catch (error) {
        console.error("Error in getTopLanguages:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// ============================================================
// ANALYTICS ROUTE #6: Most viewed concepts
// METHOD: GET
// ENDPOINT: /api/v1/analytics/views/top
// ============================================================
const getMostViewed = async (req, res) => {
    try {
        const concepts = await Concept.find()
            .sort({ views: -1 })
            .limit(10)
            .select('title views category');

        res.status(200).json({
            success: true,
            data: concepts
        });
    } catch (error) {
        console.error("Error in getMostViewed:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ANALYTICS ROUTE #7: Most bookmarked concepts
// METHOD: GET
// ENDPOINT: /api/v1/analytics/bookmarks/top
// ============================================================
const getMostBookmarked = async (req, res) => {
    try {
        const concepts = await Concept.find()
            .sort({ bookmarksCount: -1 })
            .limit(10)
            .select('title bookmarksCount category');

        res.status(200).json({
            success: true,
            data: concepts
        });
    } catch (error) {
        console.error("Error in getMostBookmarked:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ANALYTICS ROUTE #8: Trending analytics
// METHOD: GET
// ENDPOINT: /api/v1/analytics/trending
// ============================================================
const getTrending = async (req, res) => {
    try {
        const concepts = await Concept.find()
            .sort({ views: -1, bookmarksCount: -1 })
            .limit(10)
            .select('title views bookmarksCount category');

        res.status(200).json({
            success: true,
            data: concepts
        });
    } catch (error) {
        console.error("Error in getTrending:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ANALYTICS ROUTE #9: Monthly growth stats
// METHOD: GET
// ENDPOINT: /api/v1/analytics/growth
// ============================================================
const getMonthlyGrowth = async (req, res) => {
    try {
        const growth = await Concept.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: growth.map(g => ({
                period: `${g._id.year}-${String(g._id.month).padStart(2, '0')}`,
                count: g.count
            }))
        });
    } catch (error) {
        console.error("Error in getMonthlyGrowth:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ANALYTICS ROUTE #10: Most searched keywords
// METHOD: GET
// ENDPOINT: /api/v1/analytics/searches/top
// ============================================================
const getTopSearches = async (req, res) => {
    try {
        // Since there is no SearchHistory model, returning placeholder data for now.
        // In a real application, you would query a dedicated Search tracking collection.
        const placeholderSearches = [
            { keyword: "system design", count: 1245 },
            { keyword: "microservices", count: 890 },
            { keyword: "caching", count: 750 },
            { keyword: "database scaling", count: 620 },
            { keyword: "load balancer", count: 580 }
        ];

        res.status(200).json({
            success: true,
            message: "Note: Returning placeholder data as Search tracking is not yet implemented in DB.",
            data: placeholderSearches
        });
    } catch (error) {
        console.error("Error in getTopSearches:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    getTotalConcepts,
    getCategoryDistribution,
    getDifficultyStats,
    getTopPatterns,
    getTopLanguages,
    getMostViewed,
    getMostBookmarked,
    getTrending,
    getMonthlyGrowth,
    getTopSearches
};
