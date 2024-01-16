exports.handleCustomErrors = (err, req, res, next) => {
    if (err.msg && err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Unknown Error" });
};

exports.handleInvalidEndpoint = (req, res, next) => {
  res.status(404).send({ msg: "Not Found - Invalid Endpoint" });
};