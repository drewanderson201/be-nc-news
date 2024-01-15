const db = require("../db/connection")

exports.retrieveTopics = () => {

    return db.query(`SELECT * FROM topics;`).then((result)=>{
        return result.rows
    })


}