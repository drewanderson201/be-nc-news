const {
  retrieveArticleById,
  retrieveAllArticles,
  updateArticle,
  addArticle,
  removeArticle,
} = require("../models/articles.model");

const { checkExistsInDb } = require("../models/check-exists.model");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;

  retrieveArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const topicQuery = req.query.topic;
  const authorQuery = req.query.author
  const sortByQuery = req.query.sort_by;
  const orderByQuery = req.query.order_by;
  const limitQuery = req.query.limit;
  const startPageQuery = req.query.p;

  const getArticlesQuery = retrieveAllArticles(
    topicQuery,
    authorQuery,
    sortByQuery,
    orderByQuery,
    limitQuery,
    startPageQuery,
  );
  const queries = [getArticlesQuery];

  if (topicQuery) {
    const topicExistenceQuery = checkExistsInDb("topics", "slug", topicQuery);
    queries.push(topicExistenceQuery);
  }

    if (authorQuery) {
      const authorExistenceQuery = checkExistsInDb(
        "users",
        "username",
        authorQuery
      );
      queries.push(authorExistenceQuery);
    }

  Promise.all(queries)
    .then((response) => {
      res.status(200).send(response[0]);
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

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  addArticle(newArticle)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticle = (req, res, next) => {
  const articleId = req.params.article_id;

  const articleExistenceQuery = checkExistsInDb(
    "articles",
    "article_id",
    articleId
  );

  const removeArticleQuery = removeArticle(articleId)

  Promise.all([removeArticleQuery,articleExistenceQuery]).then((result) => {
    res.status(204).send();
  }).catch((err)=>{
    next(err)
  });
};
