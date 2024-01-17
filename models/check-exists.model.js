const db = require("../db/connection")
const format = require('pg-format')

exports.checkExistsInDb = (table, column, value) => {

    const lookup = {
      articles: "article",
      users: "user",
      comments: "comment",
      topics: "topic"
    };


    const queryString = format('SELECT * FROM %I WHERE %I = $1', table, column)

    return db.query(queryString, [value]).then(({rows}) => {

        if(rows.length === 0){
            return Promise.reject({status: 404, msg:`${lookup[table]} does not exist`})
        }
    });


}