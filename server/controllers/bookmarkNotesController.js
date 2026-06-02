const Concept = require("../models/Concept");
const Bookmark = require("../models/Bookmark");
const Note = require("../models/Note");
const Vote = require("../models/Vote");

// ========================
// BOOKMARK ROUTES (1-3)
// ========================

// 1. POST /api/v1/bookmarks/:conceptId
const bookmarkConcept = async (req, res) => {
    try {
        const { conceptId } = req.params;
        const { userId = "anonymous" } = req.body;

        // Verify the concept exists
        const concept = await Concept.findById(conceptId);
        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        // Check if already bookmarked
        const existingBookmark = await Bookmark.findOne({ conceptId, userId });
        if (existingBookmark) {
            return res.status(409).json({
                success: false,
                message: "Concept is already bookmarked"
            });
        }

        // Create the bookmark
        const bookmark = await Bookmark.create({ conceptId, userId });

        // Increment the bookmarksCount on the concept
        await Concept.findByIdAndUpdate(conceptId, { $inc: { bookmarksCount: 1 } });

        res.status(201).json({
            success: true,
            message: "Concept bookmarked successfully",
            data: bookmark
        });
    } catch (error) {
        console.error("Error in bookmarkConcept:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 2. DELETE /api/v1/bookmarks/:conceptId
const removeBookmark = async (req, res) => {
    try {
        const { conceptId } = req.params;
        const { userId = "anonymous" } = req.body;

        const bookmark = await Bookmark.findOneAndDelete({ conceptId, userId });

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found"
            });
        }

        // Decrement the bookmarksCount on the concept (ensure it doesn't go below 0)
        await Concept.findByIdAndUpdate(conceptId, {
            $inc: { bookmarksCount: -1 }
        });

        res.status(200).json({
            success: true,
            message: "Bookmark removed successfully"
        });
    } catch (error) {
        console.error("Error in removeBookmark:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 3. GET /api/v1/bookmarks
const fetchAllBookmarks = async (req, res) => {
    try {
        const { userId = "anonymous", page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Fetch bookmarks and populate the concept details
        const bookmarks = await Bookmark.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("conceptId");

        const total = await Bookmark.countDocuments({ userId });

        res.status(200).json({
            success: true,
            title: "Your Bookmarks",
            description: "All your bookmarked system design concepts.",
            count: bookmarks.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            data: bookmarks
        });
    } catch (error) {
        console.error("Error in fetchAllBookmarks:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ========================
// NOTES ROUTES (4-7)
// ========================

// 4. POST /api/v1/notes/:conceptId
const addNote = async (req, res) => {
    try {
        const { conceptId } = req.params;
        const { userId = "anonymous", content, title = "" } = req.body;

        // Verify the concept exists
        const concept = await Concept.findById(conceptId);
        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        if (!content || content.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Note content is required"
            });
        }

        const note = await Note.create({
            conceptId,
            userId,
            content: content.trim(),
            title: title.trim()
        });

        res.status(201).json({
            success: true,
            message: "Note added successfully",
            data: note
        });
    } catch (error) {
        console.error("Error in addNote:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 5. GET /api/v1/notes/:conceptId
const fetchNotes = async (req, res) => {
    try {
        const { conceptId } = req.params;
        const { userId = "anonymous" } = req.query;

        // Verify the concept exists
        const concept = await Concept.findById(conceptId);
        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        const notes = await Note.find({ conceptId, userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            title: `Notes for "${concept.title}"`,
            description: `All your notes on the concept "${concept.title}".`,
            conceptId,
            count: notes.length,
            data: notes
        });
    } catch (error) {
        console.error("Error in fetchNotes:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 6. PATCH /api/v1/notes/:noteId
const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { content, title } = req.body;

        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        // Update only the fields that are provided
        if (content !== undefined) {
            if (content.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Note content cannot be empty"
                });
            }
            note.content = content.trim();
        }

        if (title !== undefined) {
            note.title = title.trim();
        }

        const updatedNote = await note.save();

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: updatedNote
        });
    } catch (error) {
        console.error("Error in updateNote:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 7. DELETE /api/v1/notes/:noteId
const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        const note = await Note.findByIdAndDelete(noteId);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteNote:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ========================
// VOTES ROUTES (8-9)
// ========================

// 8. POST /api/v1/votes/:conceptId
const voteOnConcept = async (req, res) => {
    try {
        const { conceptId } = req.params;
        const { userId = "anonymous", value = 1 } = req.body;

        // Validate vote value
        if (![1, -1].includes(value)) {
            return res.status(400).json({
                success: false,
                message: "Vote value must be 1 (upvote) or -1 (downvote)"
            });
        }

        // Verify the concept exists
        const concept = await Concept.findById(conceptId);
        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        // Check for existing vote — if found, update it; otherwise, create new
        const existingVote = await Vote.findOne({ conceptId, userId });

        if (existingVote) {
            // If same vote value, remove the vote (toggle behavior)
            if (existingVote.value === value) {
                await Vote.findByIdAndDelete(existingVote._id);
                return res.status(200).json({
                    success: true,
                    message: "Vote removed (toggled off)",
                    action: "removed",
                    previousValue: existingVote.value
                });
            }

            // Update to new vote value
            existingVote.value = value;
            await existingVote.save();

            return res.status(200).json({
                success: true,
                message: `Vote updated to ${value === 1 ? "upvote" : "downvote"}`,
                action: "updated",
                data: existingVote
            });
        }

        // Create a new vote
        const vote = await Vote.create({ conceptId, userId, value });

        res.status(201).json({
            success: true,
            message: `${value === 1 ? "Upvoted" : "Downvoted"} successfully`,
            action: "created",
            data: vote
        });
    } catch (error) {
        console.error("Error in voteOnConcept:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 9. GET /api/v1/votes/top
const getTopVotedConcepts = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Aggregate votes to calculate net score per concept, then sort by highest
        const topVoted = await Vote.aggregate([
            {
                $group: {
                    _id: "$conceptId",
                    totalVotes: { $sum: 1 },
                    netScore: { $sum: "$value" },
                    upvotes: { $sum: { $cond: [{ $eq: ["$value", 1] }, 1, 0] } },
                    downvotes: { $sum: { $cond: [{ $eq: ["$value", -1] }, 1, 0] } }
                }
            },
            { $sort: { netScore: -1, totalVotes: -1 } },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: "data",
                    localField: "_id",
                    foreignField: "_id",
                    as: "concept"
                }
            },
            { $unwind: "$concept" },
            {
                $project: {
                    _id: 1,
                    totalVotes: 1,
                    netScore: 1,
                    upvotes: 1,
                    downvotes: 1,
                    concept: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            title: "Top Voted Concepts",
            description: "The highest rated system design concepts as voted by the community.",
            count: topVoted.length,
            data: topVoted
        });
    } catch (error) {
        console.error("Error in getTopVotedConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    bookmarkConcept,
    removeBookmark,
    fetchAllBookmarks,
    addNote,
    fetchNotes,
    updateNote,
    deleteNote,
    voteOnConcept,
    getTopVotedConcepts
};
