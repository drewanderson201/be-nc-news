const express = require("express")
const app = express();
app.use(express.json());
const {
  getTopics
} = require("./controllers/topics.controller");

const {
  getArticleById,
  getArticles,
  patchArticle,
} = require("./controllers/articles.controller");

const {
  getEndpoints,
} = require("./controllers/api.controller");

const {
  getCommentsByArticleId,
  postComment,
  deleteComment,
} = require("./controllers/comments.controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handleInvalidEndpoint,
} = require("./errors");

const {getUsers} = require("./controllers/users.controller")

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);





//should come after all other endpoints
app.all("/*", handleInvalidEndpoint);

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors);


module.exports = app;