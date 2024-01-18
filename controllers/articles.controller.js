

const {
  retrieveArticleById,
  retrieveAllArticles,
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


  const topicQuery = req.query.topic
  const sortByQuery = req.query.sort_by
  const orderByQuery = req.query.order_by;



  const getArticlesQuery = retrieveAllArticles(
    topicQuery,
    sortByQuery,
    orderByQuery
  );
  const queries = [getArticlesQuery]

  if(topicQuery){
      const topicExistenceQuery = checkExistsInDb("topics", "slug", topicQuery);
      queries.push(topicExistenceQuery);
  }

    Promise.all(queries)
      .then((response) => {
        const articles = response[0];

        res.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });

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
