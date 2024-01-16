
const db = require("../db/connection");


exports.retrieveCommentsByArticleId = (articleId) => {

    return db.query(
      `
    SELECT * FROM comments
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC`,
      [articleId]
    ).then((result)=>{

        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "article does not exist" });
        }
        
        return result.rows
    })
}