const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const multer = require('multer');
const fs = require('fs');  // Aggiungi questa riga
const mysql = require('mysql2');  // Aggiungi questa riga
const database = require('./database');

// Configurazione Multer per il caricamento dei file
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, 'files'));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
});
const upload = multer({ storage: storage }).single('file');

// Crea la tabella all'avvio
database.createTable();

// Serve file statici
app.use("/", express.static(path.join(__dirname, 'public')));
app.use("/files", express.static(path.join(__dirname, 'files')));

// Configurazione MySQL
//const conf = JSON.parse(fs.readFileSync('public\conf.json'));
//const confPath = path.join(__dirname, 'public', 'conf.json');
const confPath = __dirname + '\\public\\conf.json';
console.log('Percorso del file conf.json:', confPath);

let conf = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'conf.json')));


conf.ssl.ca = fs.readFileSync(__dirname + '/ca.pem');
const connection = mysql.createConnection(conf);
console.log(__dirname + '/ca.pem'); // Verifica il percorso

// Endpoint per caricare un file
app.post("/upload", upload, async (req, res) => {
    await database.insert("./files/" + req.file.originalname);
    res.json({ result: "ok" });
});

// Endpoint per ottenere la lista dei file
app.get('/images', async (req, res) => {
    const list = await database.select();
    res.json(list);
});

// Endpoint per cancellare un file
app.delete("/delete/:id", async (req, res) => {
    await database.delete(req.params.id);
    res.json({ result: "ok" });
});

// Avvio del server
const server = http.createServer(app);
server.listen(5600, () => {
    console.log('- server running');
});
