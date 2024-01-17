const { Query } = require("pg");
const db = require("../db/connection");

exports.retrieveArticleById = (articleId) => {
  return db
    .query(
      `
  SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [articleId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }

      return result.rows[0];
    });
}

exports.retrieveAllArticles = (
  topicQuery,
  sortByQuery = "created_at",
  orderByQuery = "DESC"
) => {
  const queryValues = [];
  const validSortByQueries = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!validSortByQueries.includes(sortByQuery)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort query",
    });
  }

  const validOrderByQueries = [
    "asc",
    "ASC",
    "desc",
    "DESC"
  ];

    if (!validOrderByQueries.includes(orderByQuery)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid order by query",
      });
    }

  let queryStr = `SELECT articles.article_id, articles.author, articles.title,articles.topic,articles.created_at,articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topicQuery) {
    queryStr += ` WHERE topic = $1`;
    queryValues.push(topicQuery);
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY ${sortByQuery} ${orderByQuery}`;

  return db.query(queryStr, queryValues).then((result) => {
    return result.rows;
  });
};

exports.updateArticle = (articleUpdates, articleId) => {
  return db
    .query(
      `
  UPDATE articles
  SET votes = GREATEST(0,votes + $1)
  WHERE article_id = $2
  RETURNING *`,
      [articleUpdates.inc_votes, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};