const commentsRouter = require("express").Router();

const {
  getCommentsByArticleId,
  postComment,
  deleteComment,
} = require("../controllers/comments.controller");


//commentsRouter.get("/", getCommentsByArticleId);
//commentsRouter.post("/", postComment);
commentsRouter.delete("/:comment_id", deleteComment);


module.exports = commentsRouter;
