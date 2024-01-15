

const {retrieveArticleById} = require("../models/articles.model")

exports.getArticleById = (req, res, next) => {

    const articleId = req.params.article_id

    retrieveArticleById(articleId).then((article)=>{

        res.status(200).send({ article });

    }).catch((err)=>{
        next(err)
    })

};