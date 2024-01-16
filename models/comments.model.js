
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