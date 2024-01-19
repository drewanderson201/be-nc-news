const db = require("../db/connection")

exports.retrieveTopics = () => {

    return db.query(`SELECT * FROM topics;`).then((result)=>{
        return result.rows
    })
}

exports.addTopic = (newTopic) =>{

    return db
      .query(
        `
  INSERT INTO topics
  (slug, description)
  VALUES
  ($1, $2)
  RETURNING *`,
        [newTopic.slug, newTopic.description]
      )
      .then(({ rows }) => {
        return rows[0];
      });


}