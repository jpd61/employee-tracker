// Require Dependencies
const mysql = require('mysql2');

// Connection to server
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  //PW hidden on github
  password: 'qwerty',
  database: 'employees'
});

// Export
module.exports = connection;
