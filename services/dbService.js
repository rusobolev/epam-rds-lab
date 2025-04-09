const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.insertMetadata = async (data) => {
  const sql = `
    INSERT INTO images (name, s3_key, mime_type, size, uploaded_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  const { name, s3_key, mime_type, size } = data;
  await pool.query(sql, [name, s3_key, mime_type, size]);
};
