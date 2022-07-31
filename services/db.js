require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function insertRecord(identifier, deliverAt) {
    await pool.query(
        'INSERT INTO fcm_job SET ?',
        { identifier, deliverAt }
    );
}

async function getAll() {
    return await pool.query('SELECT * FROM fcm_job');
}

module.exports = {
    insertRecord,
    getAll
}