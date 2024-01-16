const express = require("express")
const app = express();
const {
  getTopics
} = require("./controllers/topics.controller");

const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controller");

const {
  getEndpoints,
} = require("./controllers/api.controller");

const {getCommentsByArticleId} = require("./controllers/comments.controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handleInvalidEndpoint,
} = require("./errors");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);


//should come after all other endpoints
app.all("/*", handleInvalidEndpoint);

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors);


module.exports = app;