const {retrieveTopics} = require("../models/topics.model")

exports.getTopics = (req, res, next) => {


    retrieveTopics().then((topics)=>{


        res.status(200).send({topics})
    }).catch((err)=>{
        next(err)
    })
}

