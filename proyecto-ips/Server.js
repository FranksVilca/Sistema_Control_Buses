//D:\Nueva carpeta\Sistema_Control_Buses\proyecto-ips\Server.js
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

// Ruta para obtener el máximo código de usuario
app.get("/api/maxCodigoUsuario", (req, res) => {
  db.query(
    "SELECT MAX(Codigo_Usuario) AS maxCodigoUsuario FROM Usuario",
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      const maxCodigoUsuario = results[0].maxCodigoUsuario || 0; // Si no hay usuarios, devuelve 0
      res.json({ maxCodigoUsuario });
    }
  );
});

app.post("/api/insert", (req, res) => {
  const nuevoUsuario = req.body; // Datos del usuario a insertar

  db.query("INSERT INTO Usuario SET ?", nuevoUsuario, (err, result) => {
    if (err) {
      console.error("Error al insertar usuario:", err);
      res.status(500).send("Error al insertar usuario");
      return;
    }
    console.log("Usuario insertado correctamente");
    res.send("Usuario insertado exitosamente");
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

app.get("/api/cargos", (req, res) => {
  db.query("SELECT Codigo_Cargo, Descripcion FROM Cargo", (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener todas las asistencias por código de turno
app.get("/api/Asistencias/:codigoTurno", (req, res) => {
  const codigoTurno = req.params.codigoTurno;
  db.query(
      "SELECT a.Codigo_Asistencia, a.Codigo_Usuario, a.Asistencia, u.Nombre_Usuario FROM Asistencia a JOIN Usuario u ON a.Codigo_Usuario = u.Codigo_Usuario WHERE a.Codigo_Turno = ?",
      [codigoTurno],
      (err, results) => {
          if (err) {
              res.status(500).send(err);
              return;
          }
          res.json(results);
      }
  );
});

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});