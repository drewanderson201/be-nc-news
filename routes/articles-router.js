const articlesRouter = require("express").Router();

const {
  getArticleById,
  getArticles,
  patchArticle,
  postArticle,
  deleteArticle,
} = require("../controllers/articles.controller");

const {
  getCommentsByArticleId,
  postComment,
  deleteComment,
} = require("../controllers/comments.controller");

articlesRouter.route('/').get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle)
  .delete(deleteArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
