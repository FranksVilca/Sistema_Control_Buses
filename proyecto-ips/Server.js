const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3001;

// Configurar la conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'airova'
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a la Base de Datos', err);
    return;
  }
  console.log('Connectado a la Base de Datos');
});

// Rutas API
app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM Usuario', (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Servidor funcionando correctamente`);
});
