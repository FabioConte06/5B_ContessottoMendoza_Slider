const fs = require('fs');
const mysql = require('mysql2');
const { isNativeError } = require('util/types');
let conf = JSON.parse(fs.readFileSync('conf.json'));
conf.ssl = {
    ca: fs.readFileSync(__dirname + './ca.pem')
}
const connection = mysql.createConnection(conf);


const executeQuery = (sql) => {
   return new Promise((resolve, reject) => {      
         connection.query(sql, function (err, result) {
            if (err) {
               console.error(err);
               reject();     
            }   
            console.log('done');
            resolve(result);         
      });
   })
}

const database = {
   createTable: () => {
      return executeQuery(`
      CREATE TABLE IF NOT EXISTS images
         ( id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL)
      `)
    },
   insert: (name) => {
      let sql = "INSERT INTO images (name) VALUES ('$NAME')";
      sql = sql.replace('$NAME', name);
      return executeQuery(sql)
    },
   select: () => {
      const sql = `SELECT id, name FROM images`;
      return executeQuery(sql);
    },
   delete: (id) => {
      let sql = `
      DELETE FROM images
      WHERE id = $ID
      `;
      return executeQuery(sql);
    }, 
   update: (todo) => {
      let sql = `
      UPDATE todo
      SET completed=$COMPLETED
      WHERE id=$ID
         `;
      sql = sql.replace("%ID", todo.id);
      sql = sql.replace("%COMPLETED", todo.completed);
      return executeQuery(sql); 
   },
   cancellaTutto: async () => {
      return executeQuery("TRUNCATE TABLE images");
   }


}

module.exports = database;