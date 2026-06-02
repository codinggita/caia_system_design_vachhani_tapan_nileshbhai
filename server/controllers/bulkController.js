const Concept = require("../models/Concept");

// 1. POST /api/v1/concepts/bulk/create
const bulkCreateConcepts = async (req, res) => {
    try {
        const { concepts } = req.body;

        if (!concepts || !Array.isArray(concepts) || concepts.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of concepts in the 'concepts' field"
            });
        }

        // Validate each concept has required fields
        const errors = [];
        concepts.forEach((concept, index) => {
            if (!concept.title) errors.push(`Concept at index ${index} is missing 'title'`);
            if (!concept.prompt) errors.push(`Concept at index ${index} is missing 'prompt'`);
            if (!concept.response) errors.push(`Concept at index ${index} is missing 'response'`);
        });

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation errors found",
                errors
            });
        }

        // Use insertMany for efficient bulk creation
        const createdConcepts = await Concept.insertMany(concepts, { ordered: false });

        res.status(201).json({
            success: true,
            message: `Successfully created ${createdConcepts.length} concepts`,
            count: createdConcepts.length,
            data: createdConcepts
        });
    } catch (error) {
        // Handle partial insert failures (duplicate keys, validation errors)
        if (error.insertedDocs && error.insertedDocs.length > 0) {
            return res.status(207).json({
                success: false,
                message: `Partial success: ${error.insertedDocs.length} concepts created, some failed`,
                createdCount: error.insertedDocs.length,
                errors: error.writeErrors ? error.writeErrors.map(e => e.errmsg) : [error.message]
            });
        }
        console.error("Error in bulkCreateConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 2. PATCH /api/v1/concepts/bulk/update
const bulkUpdateConcepts = async (req, res) => {
    try {
        const { updates } = req.body;

        if (!updates || !Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of updates. Each update must have an 'id' and 'fields' object"
            });
        }

        // Validate each update has an id and fields
        const errors = [];
        updates.forEach((update, index) => {
            if (!update.id) errors.push(`Update at index ${index} is missing 'id'`);
            if (!update.fields || typeof update.fields !== "object") {
                errors.push(`Update at index ${index} is missing 'fields' object`);
            }
        });

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation errors found",
                errors
            });
        }

        // Execute all updates using bulkWrite for efficiency
        const bulkOps = updates.map(update => ({
            updateOne: {
                filter: { _id: update.id },
                update: { $set: update.fields }
            }
        }));

        const result = await Concept.bulkWrite(bulkOps, { ordered: false });

        res.status(200).json({
            success: true,
            message: `Bulk update completed`,
            matched: result.matchedCount,
            modified: result.modifiedCount,
            data: result
        });
    } catch (error) {
        console.error("Error in bulkUpdateConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 3. DELETE /api/v1/concepts/bulk/delete
const bulkDeleteConcepts = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of concept IDs in the 'ids' field"
            });
        }

        const result = await Concept.deleteMany({ _id: { $in: ids } });

        res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} concepts`,
            requested: ids.length,
            deleted: result.deletedCount
        });
    } catch (error) {
        console.error("Error in bulkDeleteConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 4. PATCH /api/v1/concepts/bulk/archive
const bulkArchiveConcepts = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of concept IDs in the 'ids' field"
            });
        }

        const result = await Concept.updateMany(
            { _id: { $in: ids }, isArchived: { $ne: true } },
            { $set: { isArchived: true } }
        );

        res.status(200).json({
            success: true,
            message: `Bulk archive completed`,
            requested: ids.length,
            matched: result.matchedCount,
            archived: result.modifiedCount
        });
    } catch (error) {
        console.error("Error in bulkArchiveConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 5. PATCH /api/v1/concepts/bulk/restore
const bulkRestoreConcepts = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of concept IDs in the 'ids' field"
            });
        }

        const result = await Concept.updateMany(
            { _id: { $in: ids }, isArchived: true },
            { $set: { isArchived: false } }
        );

        res.status(200).json({
            success: true,
            message: `Bulk restore completed`,
            requested: ids.length,
            matched: result.matchedCount,
            restored: result.modifiedCount
        });
    } catch (error) {
        console.error("Error in bulkRestoreConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    bulkCreateConcepts,
    bulkUpdateConcepts,
    bulkDeleteConcepts,
    bulkArchiveConcepts,
    bulkRestoreConcepts
};
