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

module.exports = {
    getTotalConcepts,
    getCategoryDistribution,
    getDifficultyStats,
    getTopPatterns,
    getTopLanguages
};
