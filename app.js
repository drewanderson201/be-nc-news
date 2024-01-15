const express = require("express")
const app = express();
const {
  getTopics,
  invalidEndpoint,
} = require("./controllers/topics.controller");

app.get("/api/topics", getTopics)

app.all("/*", invalidEndpoint)



module.exports = app;