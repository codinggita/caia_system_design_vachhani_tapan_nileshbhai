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

module.exports = {
    getBackendRoadmap,
    getFrontendRoadmap,
    getDevopsRoadmap,
    getSystemDesignRoadmap,
    suggestNextConcept
};
