
const db = require("../db/connection");


exports.retrieveCommentsByArticleId = (articleId) => {


    return db.query(
      `
    SELECT * FROM comments
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC`,
      [articleId]
    ).then((result)=>{   
        return result.rows
    })
}

exports.addComment = (newComment, articleId) => {

  return db.query(
    `
  INSERT INTO comments
  (body, article_id, author)
  VALUES
  ($1, $2, $3)
  RETURNING *`,
    [newComment.body, articleId, newComment.username]
  ).then(({rows})=>{
    return rows[0]
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
}

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