const mysql = require('mysql2');
require('dotenv').config()

const connection = mysql.createPool(process.env.DATABASE_URL);
console.log('Connected to PlanetScale!')

exports.pool = connection
