const express = require("express")
const app = express();
const {
  getTopics,
  invalidEndpoint,
} = require("./controllers/topics.controller");

const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controller");

const {
  getEndpoints,
} = require("./controllers/api.controller");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);



//should come after all other endpoints
app.all("/*", invalidEndpoint)

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});




app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Unknown Error" });
});


module.exports = app;