const db = require("../db/connection");

exports.retrieveArticleById = (articleId) => {
        return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1;`,[articleId]).then((result) => {

            if(result.rows.length === 0 ){
                return Promise.reject({ status: 404, msg: "article does not exist" });
            }

          return result.rows[0];
        });
}

exports.retreiveAllArticles = () => {

    return db
      .query(
        `SELECT articles.article_id, articles.author, articles.title,articles.topic,articles.created_at,articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`
      )
      .then((result) => {
        return result.rows;
      });

}

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