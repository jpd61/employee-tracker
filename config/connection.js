// Require Dependencies
const mysql = require('mysql2');

require('dotenv').config()

// Connection to server
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'employees'
});

// Export
module.exports = connection;
