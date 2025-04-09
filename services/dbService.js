const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.getImageMetadataByName = async (fileName) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM images WHERE name = ?';
    connection.execute(query, [fileName], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results.length === 0) {
        return reject(new Error('Image not found in database'));
      }
      resolve(results[0]);
    });
  });
};

exports.getRandomImageMetadata = async () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM images ORDER BY RAND() LIMIT 1';
      connection.execute(query, (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject(new Error('No images found in database'));
        resolve(results[0]);
      });
    });
  };

  exports.deleteImageMetadata = async (fileName) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM images WHERE name = ?';
      connection.execute(query, [fileName], (err, results) => {
        if (err) return reject(err);
        resolve();
      });
    });
  };
  