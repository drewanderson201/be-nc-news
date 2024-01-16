const db = require("../db/connection");

exports.retrieveUsers = () =>{
        return db.query(`SELECT * FROM users;`).then((result) => {
          return result.rows;
        });
}
