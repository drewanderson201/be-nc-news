const express = require("express")
const app = express();
const {
  getTopics,
  invalidEndpoint,
} = require("./controllers/topics.controller");

const {
  getEndpoints,
} = require("./controllers/api.controller");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics)


//should come after all other endpoints
app.all("/*", invalidEndpoint)



module.exports = app;