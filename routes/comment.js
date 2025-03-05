const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");

router.get("/", commentController.list);
router.get("/comments", commentController.list);
router.get("/wrongInput", commentController.wrongInput);
router.post("/comments/add", commentController.addComment);

// Voeg reactie toe
router.post("/comments/:commentId/reactions", commentController.addReaction);
// Delete a comment
router.post("/comments/:commentId/delete", commentController.deleteComment);

// verwijder reactie
router.post("/comments/:commentId/reactions/:reactionId/delete", commentController.deleteReaction);

router.post("/comments/:commentId/delete", commentController.deleteComment);

router.post("/comments/delete-old", commentController.deleteOldComments);

module.exports = router;