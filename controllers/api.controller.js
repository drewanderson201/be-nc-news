const { retrieveEndpoints } = require("../models/api.model");

exports.getEndpoints = (req, res, next) => {


  const endpoints = retrieveEndpoints()

  res.status(200).send(endpoints);

};


