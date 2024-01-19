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
  orderByQuery = "DESC",
  limitQuery = 10,
  startPageQuery = 0,
) => {
  const queryValues = [];
  const queryValuesTotalCount = [];
  const validSortByQueries = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];

  const offset = limitQuery * startPageQuery

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

  let totalCountQueryStr = `SELECT COUNT(articles.article_id) FROM articles`;

  if (topicQuery) {
    queryStr += ` WHERE topic = $1`;
    totalCountQueryStr += ` WHERE topic = $1`;
    queryValues.push(topicQuery);
    queryValuesTotalCount.push(topicQuery)
  }

  const totalCountQuery = db.query(totalCountQueryStr, queryValuesTotalCount);

  queryValues.push(limitQuery);
    queryValues.push(offset);


  queryStr += ` GROUP BY articles.article_id ORDER BY ${sortByQuery} ${orderByQuery} LIMIT $${queryValues.length - 1} OFFSET $${queryValues.length}`;

  const retrieveAllArticlesQuery = db.query(queryStr, queryValues);

  return Promise.all([retrieveAllArticlesQuery, totalCountQuery]).then((result) => {

    const articles = result[0].rows;
    const totalCount = Number(result[1].rows[0].count);

    return {"articles": articles, "total_count": totalCount};
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

exports.addArticle = (newArticle) => {

  const queries = [
    newArticle.author,
    newArticle.title,
    newArticle.body,
    newArticle.topic,
  ];
    let queryStr = `
  INSERT INTO articles
  (author, title, body, topic`

  if (newArticle.article_img_url !== undefined){
    queryStr += `, article_img_url`
    queries.push(newArticle.article_img_url);
  }

  queryStr += `)
  VALUES
  ($1, $2, $3, $4`

    if (newArticle.article_img_url !== undefined){
    queryStr += `, $5`
  }

  queryStr += `)
  RETURNING *`

    
 
    return db
      .query(queryStr, queries
  //       `
  // INSERT INTO articles
  // (author, title, body, topic, article_img_url)
  // VALUES
  // ($1, $2, $3, $4, $5)
  // RETURNING *`,
  //       [
  //         newArticle.author,
  //         newArticle.title,
  //         newArticle.body,
  //         newArticle.topic,
  //         newArticle.article_img_url,
  //       ]
      )
      .then(({ rows }) => {
        const newArticle = rows[0];
        const newArticleId = newArticle.article_id;
        const getCommentCountQuery = db.query(
          `SELECT COUNT(comments.article_id) AS comment_count FROM comments WHERE comments.article_id = $1`,
          [newArticleId]
        );
        return Promise.all([newArticle, getCommentCountQuery]);
      })
      .then((response) => {
        const newArticle = response[0];
        const newArticleCommentCount = Number(
          response[1].rows[0].comment_count
        );
        newArticle.comment_count = newArticleCommentCount;
        return newArticle;
      });
}