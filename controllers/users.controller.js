
const {
  retrieveUsers,
  retrieveUserByUsername,
} = require("../models/users.model");

exports.getUsers = (req, res, next) => {

  retrieveUsers().then((users)=>{
    res.status(200).send({users})
  }).catch((err)=>{
    next(err)
  });
};

exports.getUserByUsername = (req, res, next) => {

  const username = req.params.username

  retrieveUserByUsername(username).then((user) => {
    res.status(200).send({user})
  }).catch((err)=>{
    next(err)
  })



}