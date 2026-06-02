const Concept = require("../models/Concept");

// GET /api/v1/discovery/roadmap/backend
const getBackendRoadmap = async (req, res) => {
    try {
        // Fetch concepts related to backend architecture or patterns
        // Using regex case-insensitive matching for beginner-friendly learning path
        const backendRegex = /(backend|data|server|database|infrastructure)/i;
        const backendConcepts = await Concept.find({
            $or: [
                { "metadata.category": backendRegex },
                { category: backendRegex },
                { tags: backendRegex }
            ]
        }).limit(20);

        res.status(200).json({
            success: true,
            title: "Backend Learning Roadmap",
            description: "A beginner-friendly guided path to learn backend concepts, APIs, and databases.",
            count: backendConcepts.length,
            data: backendConcepts
        });
    } catch (error) {
        console.error("Error in getBackendRoadmap:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/discovery/roadmap/frontend
const getFrontendRoadmap = async (req, res) => {
    try {
        // Fetch concepts related to frontend development
        // Using regex case-insensitive matching for beginner-friendly learning path
        const frontendRegex = /(frontend|client|ui|web|presentation)/i;
        const frontendConcepts = await Concept.find({
            $or: [
                { "metadata.category": frontendRegex },
                { category: frontendRegex },
                { tags: frontendRegex }
            ]
        }).limit(20);

        res.status(200).json({
            success: true,
            title: "Frontend Learning Roadmap",
            description: "A structured guide to mastering frontend technologies, frameworks, and UI/UX patterns.",
            count: frontendConcepts.length,
            data: frontendConcepts
        });
    } catch (error) {
        console.error("Error in getFrontendRoadmap:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/discovery/roadmap/devops
const getDevopsRoadmap = async (req, res) => {
    try {
        // Fetch concepts related to DevOps and infrastructure
        const devopsRegex = /(devops|deployment|ci\/cd|infrastructure|cloud|orchestration|kubernetes)/i;
        const devopsConcepts = await Concept.find({
            $or: [
                { "metadata.category": devopsRegex },
                { category: devopsRegex },
                { tags: devopsRegex }
            ]
        }).limit(20);

        res.status(200).json({
            success: true,
            title: "DevOps Learning Roadmap",
            description: "An essential path covering CI/CD, containerization, cloud infrastructure, and deployment strategies.",
            count: devopsConcepts.length,
            data: devopsConcepts
        });
    } catch (error) {
        console.error("Error in getDevopsRoadmap:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/discovery/roadmap/system-design
const getSystemDesignRoadmap = async (req, res) => {
    try {
        // Fetch concepts related to system design
        const systemDesignRegex = /(system design|architecture|pattern|scalability|microservices|distributed)/i;
        const systemDesignConcepts = await Concept.find({
            $or: [
                { "metadata.category": systemDesignRegex },
                { category: systemDesignRegex },
                { tags: systemDesignRegex }
            ]
        }).limit(20);

        res.status(200).json({
            success: true,
            title: "System Design Roadmap",
            description: "A comprehensive guide to designing scalable, distributed, and highly available systems.",
            count: systemDesignConcepts.length,
            data: systemDesignConcepts
        });
    } catch (error) {
        console.error("Error in getSystemDesignRoadmap:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/discovery/suggest-next/:id
const suggestNextConcept = async (req, res) => {
    try {
        const { id } = req.params;
        const currentConcept = await Concept.findById(id);

        if (!currentConcept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        const currentCategory = (currentConcept.metadata && currentConcept.metadata.category) || currentConcept.category;

        // Prepare query to find related concepts, excluding the current one
        let query = { _id: { $ne: currentConcept._id } };

        // Search in same category
        if (currentCategory) {
            query["metadata.category"] = new RegExp(currentCategory, "i");
        }

        // Fetch up to 5 related concepts as suggestions
        const suggestions = await Concept.find(query).limit(5);

        res.status(200).json({
            success: true,
            title: "Suggested Next Concepts",
            description: `Based on your interest in "${currentConcept.title}", you might want to explore these next.`,
            count: suggestions.length,
            currentConcept: currentConcept.title,
            data: suggestions
        });
    } catch (error) {
        console.error("Error in suggestNextConcept:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 6. GET /api/v1/discovery/recommended/:userId
const getPersonalizedRecommendations = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 10 } = req.query;

        // Fetch the user's most-viewed concepts to determine preferences
        const userViewedConcepts = await Concept.find({
            views: { $gt: 0 }
        })
            .sort({ views: -1 })
            .limit(50);

        // Extract preferred categories and tags from the user's top viewed concepts
        const preferredCategories = [];
        const preferredTags = [];

        userViewedConcepts.forEach(concept => {
            const cat = (concept.metadata && concept.metadata.category) || concept.category;
            if (cat && !preferredCategories.includes(cat)) {
                preferredCategories.push(cat);
            }
            if (concept.tags) {
                concept.tags.forEach(tag => {
                    if (!preferredTags.includes(tag)) {
                        preferredTags.push(tag);
                    }
                });
            }
        });

        // Build a query to find concepts matching user preferences but with lower views (not yet explored)
        let query = { isArchived: { $ne: true } };
        const orConditions = [];

        if (preferredCategories.length > 0) {
            const categoryRegex = new RegExp(preferredCategories.slice(0, 5).join("|"), "i");
            orConditions.push({ "metadata.category": categoryRegex });
            orConditions.push({ category: categoryRegex });
        }

        if (preferredTags.length > 0) {
            orConditions.push({ tags: { $in: preferredTags.slice(0, 10) } });
        }

        if (orConditions.length > 0) {
            query.$or = orConditions;
        }

        const recommendations = await Concept.find(query)
            .sort({ views: 1, createdAt: -1 })
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            title: "Personalized Recommendations",
            description: `Concepts tailored to your learning preferences based on your activity.`,
            userId,
            count: recommendations.length,
            basedOn: {
                topCategories: preferredCategories.slice(0, 5),
                topTags: preferredTags.slice(0, 10)
            },
            data: recommendations
        });
    } catch (error) {
        console.error("Error in getPersonalizedRecommendations:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 7. GET /api/v1/discovery/trending
const getTrendingConcepts = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Fetch concepts sorted by highest views and bookmarks to surface trending content
        const trendingConcepts = await Concept.find({ isArchived: { $ne: true } })
            .sort({ views: -1, bookmarksCount: -1 })
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            title: "Trending Concepts",
            description: "The most viewed and bookmarked system design concepts right now.",
            count: trendingConcepts.length,
            data: trendingConcepts
        });
    } catch (error) {
        console.error("Error in getTrendingConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 8. GET /api/v1/discovery/hidden-gems
const getHiddenGems = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Surface lesser-known concepts — those with low views but valuable content
        // Hidden gems are non-archived concepts with the fewest views, prioritizing newer additions
        const hiddenGems = await Concept.find({
            isArchived: { $ne: true },
            views: { $lte: 5 }
        })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        // Fallback: if no low-view concepts found, fetch the least viewed overall
        if (hiddenGems.length === 0) {
            const fallbackGems = await Concept.find({ isArchived: { $ne: true } })
                .sort({ views: 1, createdAt: -1 })
                .limit(parseInt(limit));

            return res.status(200).json({
                success: true,
                title: "Hidden Gems",
                description: "Underappreciated system design concepts waiting to be discovered.",
                count: fallbackGems.length,
                data: fallbackGems
            });
        }

        res.status(200).json({
            success: true,
            title: "Hidden Gems",
            description: "Lesser-known system design concepts that deserve more attention — explore the unexplored.",
            count: hiddenGems.length,
            data: hiddenGems
        });
    } catch (error) {
        console.error("Error in getHiddenGems:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 9. GET /api/v1/discovery/expert-picks
const getExpertPicks = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Expert picks are advanced-level concepts with high engagement (views + bookmarks)
        // These represent battle-tested, high-value content recommended for experienced engineers
        const expertPicks = await Concept.find({
            difficulty: "advanced",
            isArchived: { $ne: true }
        })
            .sort({ views: -1, bookmarksCount: -1 })
            .limit(parseInt(limit));

        // Fallback: if no advanced concepts, pick the highest-engagement concepts at any level
        if (expertPicks.length === 0) {
            const fallbackPicks = await Concept.find({ isArchived: { $ne: true } })
                .sort({ bookmarksCount: -1, views: -1 })
                .limit(parseInt(limit));

            return res.status(200).json({
                success: true,
                title: "Expert Picks",
                description: "Top-rated concepts recommended by the community — the best of the best.",
                count: fallbackPicks.length,
                data: fallbackPicks
            });
        }

        res.status(200).json({
            success: true,
            title: "Expert Picks",
            description: "Advanced system design concepts hand-picked for experienced engineers and architects.",
            count: expertPicks.length,
            data: expertPicks
        });
    } catch (error) {
        console.error("Error in getExpertPicks:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 10. GET /api/v1/discovery/daily-challenge
const getDailyChallenge = async (req, res) => {
    try {
        // Generate a deterministic daily challenge using the current date as a seed
        // This ensures all users see the same challenge on the same day
        const today = new Date();
        const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

        // Create a simple numeric hash from the date string for deterministic selection
        let dateHash = 0;
        for (let i = 0; i < dateString.length; i++) {
            dateHash = ((dateHash << 5) - dateHash) + dateString.charCodeAt(i);
            dateHash = dateHash & dateHash; // Convert to 32-bit integer
        }
        dateHash = Math.abs(dateHash);

        // Get total count of available concepts
        const totalConcepts = await Concept.countDocuments({ isArchived: { $ne: true } });

        if (totalConcepts === 0) {
            return res.status(404).json({
                success: false,
                message: "No concepts available for daily challenge."
            });
        }

        // Use the date hash to deterministically pick one concept
        const skipIndex = dateHash % totalConcepts;
        const dailyConcept = await Concept.findOne({ isArchived: { $ne: true } })
            .skip(skipIndex);

        res.status(200).json({
            success: true,
            title: "Daily System Design Challenge",
            description: `Today's challenge (${dateString}): Test your knowledge with this system design concept.`,
            date: dateString,
            challengeNumber: dateHash % 9999 + 1,
            data: dailyConcept
        });
    } catch (error) {
        console.error("Error in getDailyChallenge:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    getBackendRoadmap,
    getFrontendRoadmap,
    getDevopsRoadmap,
    getSystemDesignRoadmap,
    suggestNextConcept,
    getPersonalizedRecommendations,
    getTrendingConcepts,
    getHiddenGems,
    getExpertPicks,
    getDailyChallenge
};
