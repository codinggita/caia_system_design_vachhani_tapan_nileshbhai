const Concept = require("../models/Concept");
const mongoose = require("mongoose");

// GET /api/v1/analytics/total-concepts
// Description: Returns the total number of concepts in the database
const getTotalConcepts = async (req, res) => {
    try {
        // countDocuments() counts all documents in the collection
        const total = await Concept.countDocuments();

        res.status(200).json({
            success: true,
            totalConcepts: total
        });
    } catch (error) {
        console.error("Error in getTotalConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/category-distribution
// Description: Returns how many concepts exist in each category
const getCategoryDistribution = async (req, res) => {
    try {
        // Aggregation pipeline groups documents by category and counts them
        const distribution = await Concept.aggregate([
            // Step 1: Group all documents by their category field
            {
                $group: {
                    _id: "$metadata.category",
                    count: { $sum: 1 }
                }
            },
            // Step 2: Sort by count in descending order (highest first)
            { $sort: { count: -1 } },
            // Step 3: Rename _id to category for cleaner output
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            totalCategories: distribution.length,
            data: distribution
        });
    } catch (error) {
        console.error("Error in getCategoryDistribution:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/difficulty-stats
// Description: Returns the count of concepts for each difficulty level
const getDifficultyStats = async (req, res) => {
    try {
        // Aggregation pipeline groups documents by difficulty and counts them
        const stats = await Concept.aggregate([
            // Step 1: Group all documents by their difficulty field
            {
                $group: {
                    _id: "$metadata.difficulty",
                    count: { $sum: 1 }
                }
            },
            // Step 2: Sort by count in descending order (highest first)
            { $sort: { count: -1 } },
            // Step 3: Rename _id to difficulty for cleaner output
            {
                $project: {
                    _id: 0,
                    difficulty: "$_id",
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            totalDifficultyLevels: stats.length,
            data: stats
        });
    } catch (error) {
        console.error("Error in getDifficultyStats:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/patterns/top
// Description: Returns the top patterns (subcategories) sorted by how many concepts they have
const getTopPatterns = async (req, res) => {
    try {
        // Get the limit from query, default to 10
        const limit = parseInt(req.query.limit) || 10;

        const topPatterns = await Concept.aggregate([
            // Step 1: Group all documents by their subcategory (pattern) field
            {
                $group: {
                    _id: "$metadata.subcategory",
                    count: { $sum: 1 }
                }
            },
            // Step 2: Sort by count in descending order (most concepts first)
            { $sort: { count: -1 } },
            // Step 3: Limit the results to the top N patterns
            { $limit: limit },
            // Step 4: Rename _id to pattern for cleaner output
            {
                $project: {
                    _id: 0,
                    pattern: "$_id",
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            limit: limit,
            data: topPatterns
        });
    } catch (error) {
        console.error("Error in getTopPatterns:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/languages/top
// Description: Returns the top programming languages sorted by how many concepts they have
const getTopLanguages = async (req, res) => {
    try {
        // Get the limit from query, default to 10
        const limit = parseInt(req.query.limit) || 10;

        const topLanguages = await Concept.aggregate([
            // Step 1: Only include documents that have a non-empty language field
            {
                $match: {
                    "metadata.language": { $ne: "" }
                }
            },
            // Step 2: Group all documents by their language field
            {
                $group: {
                    _id: "$metadata.language",
                    count: { $sum: 1 }
                }
            },
            // Step 3: Sort by count in descending order (most concepts first)
            { $sort: { count: -1 } },
            // Step 4: Limit the results to the top N languages
            { $limit: limit },
            // Step 5: Rename _id to language for cleaner output
            {
                $project: {
                    _id: 0,
                    language: "$_id",
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            limit: limit,
            data: topLanguages
        });
    } catch (error) {
        console.error("Error in getTopLanguages:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/views/top
// Description: Returns the most viewed concepts sorted by view count (highest first)
const getTopViewedConcepts = async (req, res) => {
    try {
        // Get the limit from query, default to 10
        const limit = parseInt(req.query.limit) || 10;

        // Find all concepts, sort by views descending, and limit results
        const topViewed = await Concept.find()
            .sort({ views: -1 })   // -1 means descending (highest views first)
            .limit(limit)
            .select("metadata.concept metadata.category views"); // Only return needed fields

        res.status(200).json({
            success: true,
            limit: limit,
            data: topViewed
        });
    } catch (error) {
        console.error("Error in getTopViewedConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/bookmarks/top
// Description: Returns the most bookmarked concepts (only those that are bookmarked)
const getTopBookmarkedConcepts = async (req, res) => {
    try {
        // Get the limit from query, default to 10
        const limit = parseInt(req.query.limit) || 10;

        // Find only bookmarked concepts, sort by views as a secondary ranking
        const topBookmarked = await Concept.find({ isBookmarked: true })
            .sort({ views: -1 })   // Among bookmarked items, show most viewed first
            .limit(limit)
            .select("metadata.concept metadata.category views isBookmarked");

        res.status(200).json({
            success: true,
            limit: limit,
            totalBookmarked: topBookmarked.length,
            data: topBookmarked
        });
    } catch (error) {
        console.error("Error in getTopBookmarkedConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/trending
// Description: Returns trending categories with their total views and concept counts
const getTrendingAnalytics = async (req, res) => {
    try {
        // Get the limit from query, default to 10
        const limit = parseInt(req.query.limit) || 10;

        const trending = await Concept.aggregate([
            // Step 1: Group documents by category
            {
                $group: {
                    _id: "$metadata.category",
                    totalViews: { $sum: "$views" },       // Sum up all views in this category
                    conceptCount: { $sum: 1 },             // Count how many concepts are in this category
                    bookmarkedCount: {                      // Count how many are bookmarked
                        $sum: { $cond: ["$isBookmarked", 1, 0] }
                    }
                }
            },
            // Step 2: Sort by totalViews descending (most viewed categories first)
            { $sort: { totalViews: -1 } },
            // Step 3: Limit to top N categories
            { $limit: limit },
            // Step 4: Rename _id to category for cleaner output
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    totalViews: 1,
                    conceptCount: 1,
                    bookmarkedCount: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            limit: limit,
            data: trending
        });
    } catch (error) {
        console.error("Error in getTrendingAnalytics:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/growth
// Description: Returns monthly growth stats (how many concepts were added each month)
const getMonthlyGrowth = async (req, res) => {
    try {
        const growth = await Concept.aggregate([
            // Step 1: Group documents by year and month of their createdAt timestamp
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },     // Extract year from createdAt
                        month: { $month: "$createdAt" }    // Extract month from createdAt
                    },
                    count: { $sum: 1 }   // Count how many concepts were created in this month
                }
            },
            // Step 2: Sort chronologically (oldest month first)
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            // Step 3: Clean up the output format
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    conceptsAdded: "$count"
                }
            }
        ]);

        res.status(200).json({
            success: true,
            totalMonths: growth.length,
            data: growth
        });
    } catch (error) {
        console.error("Error in getMonthlyGrowth:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/searches/top
// Description: Returns the most frequently appearing concept keywords (most searched topics)
const getTopSearchedKeywords = async (req, res) => {
    try {
        // Get the limit from query, default to 10
        const limit = parseInt(req.query.limit) || 10;

        const topKeywords = await Concept.aggregate([
            // Step 1: Group documents by their concept name (acts as keyword)
            {
                $group: {
                    _id: "$metadata.concept",
                    count: { $sum: 1 }   // Count how many times this concept appears
                }
            },
            // Step 2: Sort by count descending (most common keywords first)
            { $sort: { count: -1 } },
            // Step 3: Limit to top N keywords
            { $limit: limit },
            // Step 4: Rename _id to keyword for cleaner output
            {
                $project: {
                    _id: 0,
                    keyword: "$_id",
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            limit: limit,
            data: topKeywords
        });
    } catch (error) {
        console.error("Error in getTopSearchedKeywords:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/searches/failed
// Description: Returns concepts that have never been viewed (0 views = "failed" to attract searches)
const getFailedSearches = async (req, res) => {
    try {
        // Get the limit from query, default to 10
        const limit = parseInt(req.query.limit) || 10;

        // Find concepts where views is 0 or doesn't exist (never searched/viewed)
        const failedSearches = await Concept.find({
            $or: [
                { views: 0 },                    // Views is explicitly 0
                { views: { $exists: false } },    // Views field doesn't exist
                { views: null }                   // Views is null
            ]
        })
            .sort({ createdAt: -1 })  // Show newest unviewed concepts first
            .limit(limit)
            .select("metadata.concept metadata.category metadata.difficulty views createdAt");

        // Count total unviewed concepts for context
        const totalFailed = await Concept.countDocuments({
            $or: [
                { views: 0 },
                { views: { $exists: false } },
                { views: null }
            ]
        });

        res.status(200).json({
            success: true,
            limit: limit,
            totalUnviewedConcepts: totalFailed,
            data: failedSearches
        });
    } catch (error) {
        console.error("Error in getFailedSearches:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/engagement
// Description: Returns overall user engagement analytics (views, bookmarks, activity)
const getUserEngagement = async (req, res) => {
    try {
        // Use aggregation to calculate engagement metrics across all concepts
        const engagement = await Concept.aggregate([
            {
                $group: {
                    _id: null,  // Group ALL documents together (no grouping field)
                    totalConcepts: { $sum: 1 },                              // Total number of concepts
                    totalViews: { $sum: "$views" },                          // Sum of all views
                    averageViews: { $avg: "$views" },                        // Average views per concept
                    maxViews: { $max: "$views" },                            // Highest view count
                    minViews: { $min: "$views" },                            // Lowest view count
                    totalBookmarked: {                                       // Count of bookmarked concepts
                        $sum: { $cond: ["$isBookmarked", 1, 0] }
                    },
                    totalArchived: {                                         // Count of archived concepts
                        $sum: { $cond: ["$isArchived", 1, 0] }
                    }
                }
            },
            // Clean up the output
            {
                $project: {
                    _id: 0,
                    totalConcepts: 1,
                    totalViews: 1,
                    averageViews: { $round: ["$averageViews", 2] },  // Round to 2 decimal places
                    maxViews: 1,
                    minViews: 1,
                    totalBookmarked: 1,
                    totalArchived: 1,
                    bookmarkRate: {    // What percentage of concepts are bookmarked
                        $round: [
                            { $multiply: [{ $divide: ["$totalBookmarked", "$totalConcepts"] }, 100] },
                            2
                        ]
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: engagement[0] || {}  // Return first (and only) result, or empty object
        });
    } catch (error) {
        console.error("Error in getUserEngagement:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/api-performance
// Description: Returns API server performance metrics (uptime, memory usage)
const getApiPerformance = async (req, res) => {
    try {
        // process.uptime() returns how long the server has been running (in seconds)
        const uptimeInSeconds = process.uptime();

        // process.memoryUsage() returns memory stats in bytes
        const memoryUsage = process.memoryUsage();

        // Convert bytes to megabytes for readability
        const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(2) + " MB";

        res.status(200).json({
            success: true,
            data: {
                // Server uptime broken down into hours, minutes, seconds
                uptime: {
                    totalSeconds: Math.floor(uptimeInSeconds),
                    hours: Math.floor(uptimeInSeconds / 3600),
                    minutes: Math.floor((uptimeInSeconds % 3600) / 60),
                    seconds: Math.floor(uptimeInSeconds % 60)
                },
                // Memory usage of the Node.js process
                memory: {
                    rss: toMB(memoryUsage.rss),               // Total memory allocated
                    heapTotal: toMB(memoryUsage.heapTotal),   // Total heap size
                    heapUsed: toMB(memoryUsage.heapUsed),     // Heap actually used
                    external: toMB(memoryUsage.external)      // Memory used by C++ objects
                },
                // Node.js version running the server
                nodeVersion: process.version,
                // Current platform (e.g., win32, linux)
                platform: process.platform
            }
        });
    } catch (error) {
        console.error("Error in getApiPerformance:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/database-performance
// Description: Returns MongoDB database performance and connection metrics
const getDatabasePerformance = async (req, res) => {
    try {
        // mongoose.connection.readyState tells us the current DB connection status
        // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
        const readyStateMap = {
            0: "Disconnected",
            1: "Connected",
            2: "Connecting",
            3: "Disconnecting"
        };

        const connectionState = mongoose.connection.readyState;

        // Get total number of documents (a simple performance indicator)
        const totalDocuments = await Concept.countDocuments();

        // Get the number of collections in our database
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Measure how fast a simple query runs (ping test)
        const startTime = Date.now();
        await Concept.findOne();   // Run a simple query
        const queryTime = Date.now() - startTime;  // Time in milliseconds

        res.status(200).json({
            success: true,
            data: {
                connectionStatus: readyStateMap[connectionState] || "Unknown",
                databaseName: mongoose.connection.db.databaseName,
                totalDocuments: totalDocuments,
                totalCollections: collections.length,
                collectionNames: collections.map(c => c.name),  // List all collection names
                pingTimeMs: queryTime + " ms"    // How long a simple query takes
            }
        });
    } catch (error) {
        console.error("Error in getDatabasePerformance:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/cache-hit-rate
// Description: Returns cache analytics based on viewed vs unviewed concepts
// (Simulated cache — views > 0 means "cache hit", views = 0 means "cache miss")
const getCacheHitRate = async (req, res) => {
    try {
        // Count total concepts
        const totalConcepts = await Concept.countDocuments();

        // Count concepts that have been viewed at least once ("cache hits")
        const viewedConcepts = await Concept.countDocuments({ views: { $gt: 0 } });

        // Count concepts that have never been viewed ("cache misses")
        const unviewedConcepts = totalConcepts - viewedConcepts;

        // Calculate the hit rate as a percentage
        const hitRate = totalConcepts > 0
            ? ((viewedConcepts / totalConcepts) * 100).toFixed(2)
            : "0.00";

        // Calculate the miss rate as a percentage
        const missRate = totalConcepts > 0
            ? ((unviewedConcepts / totalConcepts) * 100).toFixed(2)
            : "0.00";

        res.status(200).json({
            success: true,
            data: {
                totalConcepts: totalConcepts,
                viewedConcepts: viewedConcepts,       // "Cache hits"
                unviewedConcepts: unviewedConcepts,   // "Cache misses"
                hitRate: hitRate + " %",
                missRate: missRate + " %",
                status: parseFloat(hitRate) >= 50 ? "Healthy" : "Needs Improvement"
            }
        });
    } catch (error) {
        console.error("Error in getCacheHitRate:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    getTotalConcepts,
    getCategoryDistribution,
    getDifficultyStats,
    getTopPatterns,
    getTopLanguages,
    getTopViewedConcepts,
    getTopBookmarkedConcepts,
    getTrendingAnalytics,
    getMonthlyGrowth,
    getTopSearchedKeywords,
    getFailedSearches,
    getUserEngagement,
    getApiPerformance,
    getDatabasePerformance,
    getCacheHitRate
};
