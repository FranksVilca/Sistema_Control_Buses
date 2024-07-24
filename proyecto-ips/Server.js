const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

// Configura el middleware cors para permitir solicitudes desde http://localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json());

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

//Insertar Buses
app.post("/api/insert/bus", (req, res) => {
  const { Num_Asientos, EstadoRegistro, Modelo, Marca, Placa } = req.body;

  // Primero, obtiene el valor máximo actual del IDBus
  db.query("SELECT MAX(IDBus) AS maxID FROM bus", (error, results) => {
    if (error) {
      console.error("Error al obtener el valor máximo de IDBus:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener el valor máximo de IDBus" });
    }

    // Calcula el nuevo IDBus
    const maxID = results[0].maxID || 0;
    const newIDBus = maxID + 1;

    // Inserta el nuevo bus con el nuevo IDBus
    const sql =
      "INSERT INTO bus (IDBus, Num_Asientos, EstadoRegistro, Modelo, Marca, Placa) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      newIDBus,
      Num_Asientos,
      EstadoRegistro,
      Modelo,
      Marca,
      Placa,
    ];

    db.query(sql, values, (error) => {
      if (error) {
        console.error("Error al insertar el bus:", error);
        return res.status(500).json({ error: "Error al insertar el bus" });
      }
      res.status(201).json({ message: "Bus insertado exitosamente" });
    });
  });
});

// Ruta para eliminar un bus por su ID
app.delete("/api/delete/bus/:idBus", (req, res) => {
  const idBus = req.params.idBus;
  db.query("DELETE FROM bus WHERE IDBus = ?", [idBus], (err, result) => {
    if (err) {
      console.error("Error al eliminar el bus:", err);
      return res.status(500).json({ error: "Error al eliminar el bus" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Bus no encontrado" });
    }
    res.status(200).json({ message: "Bus eliminado exitosamente" });
  });
});

// Ruta para obtener todos los buses
app.get("/api/buses", (req, res) => {
  const query = "SELECT * FROM bus";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los buses:", err);
      return res.status(500).json({ error: "Error al obtener los buses" });
    }
    res.status(200).json(results);
  });
});

// Ruta para obtener un bus por ID
app.get("/api/bus/:id", (req, res) => {
  const busId = req.params.id;
  db.query("SELECT * FROM bus WHERE IDBus = ?", [busId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Bus no encontrado" });
    }
    res.json(results[0]);
  });
});

// Ruta para actualizar un bus por ID
app.put("/api/update/bus/:idBus", (req, res) => {
  const idBus = req.params.idBus;
  const { Num_Asientos, EstadoRegistro, Modelo, Marca, Placa } = req.body;

  const query = `
    UPDATE bus
    SET Num_Asientos = ?, EstadoRegistro = ?, Modelo = ?, Marca = ?, Placa = ?
    WHERE IDBus = ?
  `;

  db.query(
    query,
    [Num_Asientos, EstadoRegistro, Modelo, Marca, Placa, idBus],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar el bus:", err);
        return res.status(500).json({ error: "Error al actualizar el bus" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Bus no encontrado" });
      }
      res.status(200).json({ message: "Bus actualizado exitosamente" });
    }
  );
});

// Obtener todos los horarios
app.get("/api/horarios", (req, res) => {
  const query = "SELECT * FROM Horario";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los horarios:", err);
      return res.status(500).json({ error: "Error al obtener los horarios" });
    }
    // Asegúrate de que los datos están en el formato esperado
    res.status(200).json(
      results.map((row) => ({
        ...row,
        Fecha: row.Fecha.toISOString().split("T")[0], // Formato YYYY-MM-DD
        Hora_Salida: row.Hora_Salida.toISOString()
          .split("T")[1]
          .substring(0, 5), // Formato HH:mm
        Hora_Llegada: row.Hora_Llegada.toISOString()
          .split("T")[1]
          .substring(0, 5), // Formato HH:mm
      }))
    );
  });
});

// Obtener un horario por ID
app.get("/api/horario/:id", (req, res) => {
  const horarioId = req.params.id;
  db.query(
    "SELECT * FROM Horario WHERE IDHorario = ?",
    [horarioId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Error en la base de datos" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Horario no encontrado" });
      }
      const horario = results[0];
      horario.Fecha = horario.Fecha.toISOString().split("T")[0]; // Asegúrate de enviar en formato YYYY-MM-DD
      res.json(horario);
    }
  );
});

// Insertar un nuevo horario
app.post("/api/insert/horario", (req, res) => {
  const { Fecha, Hora_Salida, Hora_Llegada } = req.body;

  // Primero, obtiene el valor máximo actual del IDHorario
  db.query("SELECT MAX(IDHorario) AS maxID FROM Horario", (error, results) => {
    if (error) {
      console.error("Error al obtener el valor máximo de IDHorario:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener el valor máximo de IDHorario" });
    }

    // Calcula el nuevo IDHorario
    const maxID = results[0].maxID || 0;
    const newIDHorario = maxID + 1;

    // Inserta el nuevo horario con el nuevo IDHorario
    const sql =
      "INSERT INTO Horario (IDHorario, Fecha, Hora_Salida, Hora_Llegada) VALUES (?, ?, ?, ?)";
    const values = [newIDHorario, Fecha, Hora_Salida, Hora_Llegada];

    db.query(sql, values, (error) => {
      if (error) {
        console.error("Error al insertar el horario:", error);
        return res.status(500).json({ error: "Error al insertar el horario" });
      }
      res.status(201).json({ message: "Horario insertado exitosamente" });
    });
  });
});

// Endpoint para asignar asistencia a los trabajadores
app.post("/api/asistencia", async (req, res) => {
  const { Codigo_Turno, Trabajadores, Num_Asientos } = req.body;

  if (!Codigo_Turno || !Trabajadores || Trabajadores.length === 0) {
    return res.status(400).json({ message: "Datos inválidos" });
  }

  if (Trabajadores.length < 1 || Trabajadores.length > Num_Asientos) {
    return res.status(400).json({
      message: `El número de trabajadores seleccionados debe ser entre 1 y ${Num_Asientos}.`,
    });
  }

  try {
    // Obtener el valor máximo de Codigo_Asistencia
    const [rows] = await db
      .promise()
      .query("SELECT MAX(Codigo_Asistencia) AS maxId FROM Asistencia");
    const maxId = rows[0].maxId ? rows[0].maxId : 0;
    const newCodigoAsistencia = maxId + 1;

    // Preparar los datos para insertar en la tabla Asistencia
    const values = Trabajadores.map((codigoUsuario) => [
      newCodigoAsistencia,
      Codigo_Turno,
      codigoUsuario,
      true,
    ]);

    // Insertar los registros en la tabla Asistencia
    await db
      .promise()
      .query(
        "INSERT INTO Asistencia (Codigo_Asistencia, Codigo_Turno, Codigo_Usuario, Asistencia) VALUES ?",
        [values]
      );

    res.status(200).json({ message: "Asistencia guardada exitosamente" });
  } catch (error) {
    console.error("Error al guardar la asistencia:", error);
    res.status(500).json({ message: "Error al guardar la asistencia", error });
  }
});

app.get("/api/usuarios", (req, res) => {
  const cargo = req.query.cargo;
  let query = "SELECT * FROM Usuario";
  let params = [];

  if (cargo) {
    query += " WHERE Codigo_Cargo = ?";
    params.push(cargo);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return handleError(res, err, "Error al obtener usuarios");
    }
    res.json(results);
  });
});

// Actualizar un horario por ID
app.put("/api/update/horario/:idHorario", (req, res) => {
  const idHorario = req.params.idHorario;
  const { Fecha, Hora_Salida, Hora_Llegada } = req.body;

  const query = `
    UPDATE Horario
    SET Fecha = ?, Hora_Salida = ?, Hora_Llegada = ?
    WHERE IDHorario = ?
  `;

  db.query(
    query,
    [Fecha, Hora_Salida, Hora_Llegada, idHorario],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar el horario:", err);
        return res
          .status(500)
          .json({ error: "Error al actualizar el horario" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Horario no encontrado" });
      }
      res.status(200).json({ message: "Horario actualizado exitosamente" });
    }
  );
});

// Eliminar un horario por ID
app.delete("/api/delete/horario/:idHorario", (req, res) => {
  const idHorario = req.params.idHorario;
  db.query(
    "DELETE FROM Horario WHERE IDHorario = ?",
    [idHorario],
    (err, result) => {
      if (err) {
        console.error("Error al eliminar el horario:", err);
        return res.status(500).json({ error: "Error al eliminar el horario" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Horario no encontrado" });
      }
      res.status(200).json({ message: "Horario eliminado exitosamente" });
    }
  );
});

// Obtener todas las rutas
app.get("/api/rutas", (req, res) => {
  const sql = "SELECT * FROM Ruta";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching routes:", err);
      res.status(500).send("Error fetching routes");
      return;
    }
    res.json(results);
  });
});

// Obtener una ruta específica por ID
app.get("/api/ruta/:IDRuta", (req, res) => {
  const { IDRuta } = req.params;
  const sql = "SELECT * FROM Ruta WHERE IDRuta = ?";
  db.query(sql, [IDRuta], (err, result) => {
    if (err) {
      console.error("Error fetching route:", err);
      res.status(500).send("Error fetching route");
      return;
    }
    if (result.length === 0) {
      // No se encontró la ruta con el ID especificado
      res.status(404).send("Ruta no encontrada");
      return;
    }
    res.json(result[0]); // Devolver el primer objeto del array
  });
});

// Crear una nueva ruta
app.post("/api/ruta", (req, res) => {
  const { IDRuta, PuntoSalida, PuntoLlegada } = req.body;
  const sql =
    "INSERT INTO Ruta (IDRuta, PuntoSalida, PuntoLlegada) VALUES (?, ?, ?)";
  db.query(sql, [IDRuta, PuntoSalida, PuntoLlegada], (err, result) => {
    if (err) {
      console.error("Error creating route:", err);
      res.status(500).send("Error creating route");
      return;
    }
    res.json({ IDRuta, PuntoSalida, PuntoLlegada });
  });
});

app.get("/api/turnos", (req, res) => {
  db.query("SELECT * FROM vistaturnos", (err, results) => {
    if (err) {
      console.error("Error al obtener los turnos:", err);
      return res.status(500).send("Error al obtener los turnos");
    }
    res.json(results);
  });
});

//Conseguir el Maximo ID
app.get("/api/rutas/max", (req, res) => {
  const query = "SELECT MAX(IDRuta) AS maxCodigoRuta FROM Ruta";
  db.query(query, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Error al obtener el máximo código de ruta" });
    }
    res.json({ maxCodigoRuta: results[0].maxCodigoRuta });
  });
});

// Actualizar una ruta existente
app.put("/api/ruta/:IDRuta", (req, res) => {
  const { IDRuta } = req.params;
  const { PuntoSalida, PuntoLlegada } = req.body;
  const sql =
    "UPDATE Ruta SET PuntoSalida = ?, PuntoLlegada = ? WHERE IDRuta = ?";
  db.query(sql, [PuntoSalida, PuntoLlegada, IDRuta], (err, result) => {
    if (err) {
      console.error("Error updating route:", err);
      res.status(500).send("Error updating route");
      return;
    }
    res.json({ IDRuta, PuntoSalida, PuntoLlegada });
  });
});

// Eliminar una ruta existente
app.delete("/api/ruta/:IDRuta", (req, res) => {
  const { IDRuta } = req.params;
  const sql = "DELETE FROM Ruta WHERE IDRuta = ?";
  db.query(sql, [IDRuta], (err, result) => {
    if (err) {
      console.error("Error deleting route:", err);
      res.status(500).send("Error deleting route");
      return;
    }
    res.json({ message: "Route deleted successfully" });
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
