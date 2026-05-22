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

module.exports = {
    filterByCategory,
    filterByDifficulty,
    filterByPattern,
    filterByLanguage
};
