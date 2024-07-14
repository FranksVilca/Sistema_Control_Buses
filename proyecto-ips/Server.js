const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3001;

// Configura el middleware cors para permitir solicitudes desde http://localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Middleware para analizar JSON
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "airova",
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la Base de Datos", err);
    return;
  }
  console.log("Conectado a la Base de Datos");
});

// Ruta para obtener todos los usuarios
app.get("/api/data", (req, res) => {
  db.query("SELECT * FROM Usuario", (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener un usuario por su código
app.get("/api/data/:codigoUsuario", (req, res) => {
  const codigoUsuario = req.params.codigoUsuario;
  db.query(
    "SELECT * FROM Usuario WHERE Codigo_Usuario = ?",
    [codigoUsuario],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (results.length === 0) {
        res.status(404).send("Usuario no encontrado");
        return;
      }
      res.json(results[0]);
    }
  );
});

// Ruta para actualizar un usuario por su código
app.put("/api/update/:codigoUsuario", (req, res) => {
  const codigoUsuario = req.params.codigoUsuario;
  const updatedUser = req.body;

  db.query(
    "UPDATE Usuario SET ? WHERE Codigo_Usuario = ?",
    [updatedUser, codigoUsuario],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.send("Usuario actualizado exitosamente");
    }
  );
});

app.delete("/api/delete/:codigoUsuario", (req, res) => {
  console.log(
    "Ruta llamada para eliminar usuario con código:",
    req.params.codigoUsuario
  ); // <-- Añade esto
  const codigoUsuario = req.params.codigoUsuario;

  db.query(
    "DELETE FROM Usuario WHERE Codigo_Usuario = ?",
    [codigoUsuario],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).send("Usuario no encontrado");
        return;
      }
      res.send("Usuario eliminado exitosamente");
    }
  );
});

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
