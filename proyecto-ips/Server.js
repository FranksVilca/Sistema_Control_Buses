const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

// Configuración de Multer para manejar la carga de archivos
const storage = multer.memoryStorage(); // Guarda archivos en memoria
const upload = multer({ storage: storage });

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

// Función para manejar errores
const handleError = (res, err, message) => {
  console.error(message, err);
  res.status(500).send(message);
};

// Función de validación
const validateUser = async (user) => {
  const { Edad, img } = user;

  // Validar el rango de edad
  const edad = parseInt(Edad);
  if (edad < 18 || edad > 60) {
    throw new Error("La edad debe estar entre 18 y 60 años");
  }

  // Validar el archivo de imagen
  if (img) {
    const { default: fileType } = await import("file-type");
    const type = await fileType.fromBuffer(img);
    if (!type || !type.mime.startsWith("image/")) {
      throw new Error("El archivo subido no es una imagen válida");
    }
  }
};

// Ruta para obtener todos los usuarios
app.get("/api/data", (req, res) => {
  db.query("SELECT * FROM Usuario", (err, results) => {
    if (err) {
      return handleError(res, err, "Error al obtener usuarios");
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
        return handleError(
          res,
          err,
          "Error al obtener el código máximo de usuario"
        );
      }
      const maxCodigoUsuario = results[0].maxCodigoUsuario || 0; // Si no hay usuarios, devuelve 0
      res.json({ maxCodigoUsuario });
    }
  );
});

// Ruta para insertar un nuevo usuario
app.post("/api/insert", upload.single("img"), async (req, res) => {
  const nuevoUsuario = req.body;
  try {
    await validateUser(nuevoUsuario);

    const query = `INSERT INTO Usuario (
      Codigo_Usuario,
      Nombre,
      Nombre_Usuario,
      Contrasena,
      DNI,
      Codigo_Cargo,
      Edad,
      Sexo,
      Celular,
      Email,
      Direccion,
      EstadoRegistro,
      img
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      query,
      [
        nuevoUsuario.Codigo_Usuario,
        nuevoUsuario.Nombre,
        nuevoUsuario.Nombre_Usuario,
        nuevoUsuario.Contrasena,
        nuevoUsuario.DNI,
        nuevoUsuario.Codigo_Cargo,
        nuevoUsuario.Edad,
        nuevoUsuario.Sexo,
        nuevoUsuario.Celular,
        nuevoUsuario.Email,
        nuevoUsuario.Direccion,
        nuevoUsuario.EstadoRegistro,
        req.file ? req.file.buffer : null,
      ],
      (err, result) => {
        if (err) {
          return handleError(res, err, "Error al insertar usuario");
        }
        res.send("Usuario insertado exitosamente");
      }
    );
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Ruta para obtener un usuario por su código
app.get("/api/data/:codigoUsuario", (req, res) => {
  const codigoUsuario = req.params.codigoUsuario;
  db.query(
    "SELECT * FROM Usuario WHERE Codigo_Usuario = ?",
    [codigoUsuario],
    (err, results) => {
      if (err) {
        return handleError(res, err, "Error al obtener usuario");
      }
      if (results.length === 0) {
        return res.status(404).send("Usuario no encontrado");
      }
      res.json(results[0]);
    }
  );
});

// Ruta para actualizar un usuario por su código
app.put(
  "/api/update/:codigoUsuario",
  upload.single("img"),
  async (req, res) => {
    const codigoUsuario = req.params.codigoUsuario;
    const updatedUser = req.body;
    const img = req.file ? req.file.buffer : null;

    try {
      // Validar los datos del usuario
      await validateUser(updatedUser);

      // Consultar usuario actual para obtener la imagen si no se proporciona una nueva
      const [currentUser] = await new Promise((resolve, reject) => {
        db.query(
          "SELECT img FROM Usuario WHERE Codigo_Usuario = ?",
          [codigoUsuario],
          (err, results) => {
            if (err) return reject(err);
            resolve(results);
          }
        );
      });

      const existingImg = currentUser.img;

      // Actualizar el usuario
      const query = `UPDATE Usuario SET 
      Nombre = ?, 
      Nombre_Usuario = ?, 
      Contrasena = ?, 
      DNI = ?, 
      Codigo_Cargo = ?, 
      Edad = ?, 
      Sexo = ?, 
      Celular = ?, 
      Email = ?, 
      Direccion = ?, 
      EstadoRegistro = ?, 
      img = ? 
      WHERE Codigo_Usuario = ?`;

      db.query(
        query,
        [
          updatedUser.Nombre,
          updatedUser.Nombre_Usuario,
          updatedUser.Contrasena,
          updatedUser.DNI,
          updatedUser.Codigo_Cargo,
          updatedUser.Edad,
          updatedUser.Sexo,
          updatedUser.Celular,
          updatedUser.Email,
          updatedUser.Direccion,
          updatedUser.EstadoRegistro,
          img || existingImg, // Si no hay una imagen nueva, conserva la imagen existente
          codigoUsuario,
        ],
        (err, result) => {
          if (err) {
            return handleError(res, err, "Error al actualizar usuario");
          }
          res.send("Usuario actualizado exitosamente");
        }
      );
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

// Ruta para eliminar un usuario por su código
app.delete("/api/delete/:codigoUsuario", (req, res) => {
  const codigoUsuario = req.params.codigoUsuario;

  db.query(
    "DELETE FROM Usuario WHERE Codigo_Usuario = ?",
    [codigoUsuario],
    (err, result) => {
      if (err) {
        return handleError(res, err, "Error al eliminar usuario");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Usuario no encontrado");
      }
      res.send("Usuario eliminado exitosamente");
    }
  );
});

// Ruta para obtener todos los cargos
app.get("/api/cargos", (req, res) => {
  db.query("SELECT Codigo_Cargo, Descripcion FROM Cargo", (err, results) => {
    if (err) {
      return handleError(res, err, "Error al obtener cargos");
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
