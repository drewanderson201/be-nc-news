

const {
  retrieveArticleById,
  retreiveAllArticles,
  updateArticle
} = require("../models/articles.model");

const {checkExistsInDb} = require("../models/check-exists.model")

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

exports.patchArticle = (req, res, next) => {

  const articleId = req.params.article_id;
  const articleUpdates = req.body;

    const articleExistenceQuery = checkExistsInDb(
      "articles",
      "article_id",
      articleId
    );

  const updateArticleQuery = updateArticle(articleUpdates, articleId);

  Promise.all([updateArticleQuery, articleExistenceQuery])
    .then((response) => {
      const article = response[0];

      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
