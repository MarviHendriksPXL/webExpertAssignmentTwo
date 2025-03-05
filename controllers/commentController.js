
const mongoSanitize = require('express-mongo-sanitize');
const Comment = require('../models/commentModel.js');


module.exports.list = async function (req, res, next) {
    try {
        let query = {};
        const searchQuery = req.query.search;
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const skip = (page - 1) * pageSize;
        let comments;
        if (searchQuery) {
            comments = await Comment.find({ text: { $regex: new RegExp(mongoSanitize.sanitize(req.query.search), 'i') } })
                .sort({ date: -1 })
                .skip(skip)
                .limit(pageSize);
        } else {
            comments = await Comment.find({})
                .sort({ date: -1 })
                .skip(skip)
                .limit(pageSize);
        }

        const totalCommentsCount = await Comment.countDocuments(query);
        const totalPages = Math.ceil(totalCommentsCount / pageSize || 1);
        const commentsWithReversedReactions = comments.map(comment => ({
            ...comment.toObject(),
            reactions: comment.reactions.slice().reverse(),
        }));
        res.render("comments/list", {
            comments: commentsWithReversedReactions,
            currentPage: page,
            totalPages: totalPages,
            search: req.query.search,
        });
    } catch (error) {
        res.render("comments/list", { error });
    }
};

module.exports.addComment = async function (req, res, next) {
    try {
        const commentText = mongoSanitize.sanitize(req.body.commentText);
        const date = new Date();

        if (!commentText) {
            return res.status(400).json({ error: "Comment text is required" });
        }

        const newComment = new Comment({ text: commentText, date: date });
        await newComment.save();

        res.redirect("/");
    } catch (error) {
        res.redirect("wrongInput");
    }
};

module.exports.wrongInput = function (req, res, next) {
    res.render("comments/wrongInput");
};

module.exports.addReaction = async function (req, res, next) {
    try {
        const commentId = req.params.commentId;
        const reaction = mongoSanitize.sanitize(req.body.reaction);

        await Comment.findByIdAndUpdate(commentId, {
            $push: { reactions: reaction },
        });

        res.redirect("/");
    } catch (error) {
        next(error);
    }
};

module.exports.deleteComment = async function (req, res, next) {
    try {
        const commentId = req.params.commentId;
        await Comment.findByIdAndDelete(commentId);
        res.redirect("/");
    } catch (error) {
        next(error);
    }
};

module.exports.deleteReaction = async function (req, res, next) {
    try {
        const commentId = req.params.commentId;
        const reactionId = req.params.reactionId;

        await Comment.findByIdAndUpdate(commentId, {
            $pull: { reactions: reactionId },
        });

        res.redirect("/");
    } catch (error) {
        next(error);
    }
};

module.exports.deleteOldComments = async function (req, res, next) {
    try {
        const dateString = mongoSanitize.sanitize(req.body.deleteDate);

        const deleteDate = new Date(dateString);
        if (isNaN(deleteDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        await Comment.deleteMany({ date: { $lt: deleteDate } });
        await Comment.updateMany(
            { "reactions.date": { $lt: deleteDate } },
            { $pull: { reactions: { date: { $lt: deleteDate } } } }
        );

        res.redirect("/");
    } catch (error) {
        next(error);
    }
};