const fs = require('fs');
const mysql = require('mysql2');

let conf = JSON.parse(fs.readFileSync('public/conf.json'));
conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')  // Corretto il path
};

const connection = mysql.createConnection(conf);

const executeQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const database = {
    createTable: () => {
        return executeQuery(`
            CREATE TABLE IF NOT EXISTS images (
                id INT PRIMARY KEY AUTO_INCREMENT,
                url VARCHAR(255) NOT NULL
            )
        `);
    },
    
    insert: (url) => {
        const sql = "INSERT INTO images (url) VALUES (?)";
        return executeQuery(sql, [url]);
    },
    
    select: () => {
        const sql = "SELECT id, url FROM images";
        return executeQuery(sql);
    },
    
    delete: (id) => {
        const sql = "DELETE FROM images WHERE id = ?";
        return executeQuery(sql, [id]);
    },
    
    cancellaTutto: () => {
        return executeQuery("TRUNCATE TABLE images");
    }
};

module.exports = database;
