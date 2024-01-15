const {retrieveTopics} = require("../models/topics.model")

exports.getTopics = (req, res, next) => {

    retrieveTopics().then((topics)=>{
        res.status(200).send({topics})
    })
}

exports.invalidEndpoint = (req, res, next) => {
    res.status(404).send({ msg: "Not Found - Invalid Endpoint" });
};