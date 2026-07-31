const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = {
    query: function(sql, values) {
        return new Promise(function(resolve, reject) {
            pool.query(sql, values, function(error, results) {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
};