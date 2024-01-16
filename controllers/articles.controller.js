

const {
  retrieveArticleById,
  retreiveAllArticles,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {

    const articleId = req.params.article_id

    retrieveArticleById(articleId).then((article)=>{

        res.status(200).send({ article });

    }).catch((err)=>{
        next(err)
    })

};

exports.getArticles = (req, res, next) => {

    retreiveAllArticles().then((articles)=>{

        res.status(200).send({ articles });



    })

};