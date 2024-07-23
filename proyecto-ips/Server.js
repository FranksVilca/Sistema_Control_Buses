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

// Middleware para analizar JSON con un límite de tamaño
app.use(express.json({ limit: "10mb" })); // Ajusta el límite según tus necesidades
app.use(express.urlencoded({ limit: "10mb", extended: true })); // También para datos de formularios si es necesario

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
app.put("/api/update/:codigoUsuario", async (req, res) => {
  const codigoUsuario = req.params.codigoUsuario;
  const updatedUser = req.body;

  try {
    await validateUser(updatedUser);

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
      EstadoRegistro = ? 
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
        codigoUsuario,
      ],
      (err, result) => {
        if (err) {
          console.error("Error en la base de datos:", err); // Verifica errores
          return handleError(res, err, "Error al actualizar usuario");
        }
        res.send("Usuario actualizado exitosamente");
      }
    );
  } catch (err) {
    res.status(400).send(err.message);
  }
});

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

// Ruta para obtener todas las asistencias por código de turno
app.get("/api/asistencias/:codigoTurno", (req, res) => {
  const codigoTurno = req.params.codigoTurno;
  db.query(
    `SELECT a.Codigo_Asistencia, a.Codigo_Usuario, u.Nombre
     FROM asistencia a
     JOIN usuario u ON a.Codigo_Usuario = u.Codigo_Usuario
     WHERE a.Codigo_Turno = ?`,
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

// Modificar Asistencias
// Ruta para actualizar la asistencia
app.put("/api/Asistencia/:codigoAsistencia", (req, res) => {
  const { codigoAsistencia } = req.params;
  const { Asistencia } = req.body;

  // Validar el valor de Asistencia
  if (Asistencia !== 1 && Asistencia !== 0) {
    return res.status(400).json({ error: "Invalid Asistencia value" });
  }

  // Actualizar el registro en la base de datos
  db.query(
    "UPDATE asistencia SET Asistencia = ? WHERE Codigo_Asistencia = ?",
    [Asistencia, codigoAsistencia],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Asistencia not found" });
      }

      res.status(200).json({ message: "Asistencia updated successfully" });
    }
  );
});

// Revisar Usuario
app.post("/api/login", (req, res) => {
  const { Nombre_Usuario, Contrasena } = req.body;
  if (!Nombre_Usuario || !Contrasena) {
    return res
      .status(400)
      .json({ error: "Nombre de usuario y contraseña son requeridos" });
  }

  db.query(
    "SELECT * FROM Usuario WHERE Nombre_Usuario = ? AND Contrasena = ?",
    [Nombre_Usuario, Contrasena],
    (err, results) => {
      if (err) {
        console.error("Error de base de datos:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ error: "Nombre de usuario o contraseña incorrectos" });
      }

      res
        .status(200)
        .json({ message: "Inicio de sesión exitoso", user: results[0] });
    }
  );
});

//Encontrar Usuario
app.get("/api/usuario/:codigo_usuario", async (req, res) => {
  const { codigo_usuario } = req.params;
  const queryUsuario = `
      SELECT u.*, c.Descripcion AS Cargo
      FROM Usuario u
      JOIN Cargo c ON u.Codigo_Cargo = c.Codigo_Cargo
      WHERE u.Codigo_Usuario = ?
  `;
  db.query(queryUsuario, [codigo_usuario], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const usuario = results[0];
    if (usuario.img) {
      usuario.img = usuario.img.toString("base64"); // Convertir imagen a base64 si existe
    } else {
      usuario.img = null; // Si no hay imagen, establecer como null
    }
    res.json(usuario);
  });
});

// Rutas para turnos
app.get("/api/turnos", (req, res) => {
  db.query("SELECT * FROM vistaturnos", (err, results) => {
    if (err) {
      console.error("Error al obtener los turnos:", err);
      return res.status(500).send("Error al obtener los turnos");
    }
    res.json(results);
  });
});

app.put("/api/turnos/inactivar/:codigoTurno", (req, res) => {
  const { codigoTurno } = req.params;

  // Marca el turno como inactivo en lugar de eliminarlo
  db.query(
    "UPDATE turno SET Activo = 0 WHERE Codigo_Turno = ?",
    [codigoTurno],
    (err, result) => {
      if (err) {
        console.error("Error al inactivar turno:", err);
        return res.status(500).send("Error al inactivar turno");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Turno no encontrado");
      }
      res.send("Turno marcado como inactivo exitosamente");
    }
  );
});

const getNextTurnoCodigo = (callback) => {
  const sql = "SELECT MAX(Codigo_Turno) AS maxCodigoTurno FROM Turno";
  db.query(sql, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    const maxCodigoTurno = results[0].maxCodigoTurno || 0;
    const nextCodigoTurno = maxCodigoTurno + 1;
    callback(null, nextCodigoTurno);
  });
};

app.post("/api/insertarTurno", (req, res) => {
  const { IDRuta, IDHorario, IDBus, IDChofer } = req.body;

  getNextTurnoCodigo((err, nextCodigoTurno) => {
    if (err) {
      console.error("Error al obtener el siguiente código de turno:", err);
      return res
        .status(500)
        .send("Error al obtener el siguiente código de turno");
    }

    const sql =
      "INSERT INTO Turno (Codigo_Turno, IDRuta, IDHorario, IDBus, IDChofer) VALUES (?, ?, ?, ?, ?)";
    db.query(
      sql,
      [nextCodigoTurno, IDRuta, IDHorario, IDBus, IDChofer],
      (err, result) => {
        if (err) {
          console.error("Error al insertar el turno:", err);
          res.status(500).send("Error al insertar el turno");
        } else {
          res.send("Turno insertado exitosamente");
        }
      }
    );
  });
});

app.get("/api/buses", (req, res) => {
  const sql = "SELECT IDBus, Placa, Num_Asientos FROM Bus";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener los buses:", err);
      res.status(500).send("Error al obtener los buses");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/horarios", (req, res) => {
  const sql = "SELECT IDHorario, Fecha, Hora_Salida FROM Horario";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios:", err);
      res.status(500).send("Error al obtener los horarios");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/rutas", (req, res) => {
  const sql = "SELECT IDRuta, PuntoSalida, PuntoLlegada FROM Ruta";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener las rutas:", err);
      res.status(500).send("Error al obtener las rutas");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/conductores", (req, res) => {
  const sql =
    "SELECT Codigo_Usuario, Nombre FROM Usuario WHERE Codigo_Cargo = '3'";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener los conductores:", err);
      res.status(500).send("Error al obtener los conductores");
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
