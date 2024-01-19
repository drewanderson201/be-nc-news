const db = require("../db/connection");

exports.retrieveCommentsByArticleId = (
  articleId,
  limitQuery = 10,
  startPageQuery = 0,
) => {

  const offset = limitQuery * startPageQuery;


  const totalCommentCountQuery = db.query(
    `
    SELECT COUNT(comments.comment_id) FROM comments
    WHERE comments.article_id = $1
    `,
    [articleId]
  );

  const retrieveCommentsQuery = db.query(
    `
    SELECT * FROM comments
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC
    LIMIT $2
    OFFSET $3`,
    [articleId, limitQuery, offset]
  );

  return Promise.all([retrieveCommentsQuery, totalCommentCountQuery]).then(
    (result) => {
      const comments = result[0].rows;
      const totalCount = Number(result[1].rows[0].count);
      return { comments: comments, total_count: totalCount };
    }
  );
};

exports.addComment = (newComment, articleId) => {
  return db
    .query(
      `
  INSERT INTO comments
  (body, article_id, author)
  VALUES
  ($1, $2, $3)
  RETURNING *`,
      [newComment.body, articleId, newComment.username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (commentId) => {
  return db
    .query(
      `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *`,
      [commentId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateComment = (commentUpdates, commentId) => {
  return db
    .query(
      `
  UPDATE comments
  SET votes = GREATEST(0,votes + $1)
  WHERE comment_id = $2
  RETURNING *`,
      [commentUpdates.inc_votes, commentId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
