const express = require("express")
const app = express();
app.use(express.json());


const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handleInvalidEndpoint,
} = require("./errors");


const apiRouter = require("./routes/api-router");


app.use("/api", apiRouter)

//should come after all other endpoints
app.all("/*", handleInvalidEndpoint);

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors);


module.exports = app;