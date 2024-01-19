const { retrieveTopics, addTopic} = require("../models/topics.model");

exports.getTopics = (req, res, next) => {


    retrieveTopics().then((topics)=>{


        res.status(200).send({topics})
    }).catch((err)=>{
        next(err)
    })
}

exports.postTopic = (req, res, next) => {

    const newTopic = req.body

    addTopic(newTopic).then((response)=>{
        const topic = response
        res.status(201).send({topic})
    }).catch((err)=>{
        next(err)
    })

}

