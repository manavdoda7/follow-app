require('dotenv').config()
const mysql = require('mysql2')

const db_config = {
    host: process.env.DB,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
}

let db = mysql.createConnection(db_config)


setInterval(function () {
    db.query("select 1;");
}, 5000);

module.exports = db;