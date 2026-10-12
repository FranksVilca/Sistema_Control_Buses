const mysql = require("mysql2");
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "airova",
});

db.connect(async (err) => {
  if (err) throw err;
  console.log("Conectado a la Base de Datos");

  // Primero insertar el cargo
  db.query(`INSERT IGNORE INTO Cargo (Codigo_Cargo, Descripcion) VALUES (1, 'Administrador')`, async (err) => {
    if (err) {
        console.log("Error creando cargo:", err.message);
        db.end();
        return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const query = `INSERT IGNORE INTO Usuario (
      Codigo_Usuario, Nombre, Nombre_Usuario, Contrasena, DNI, Codigo_Cargo, Edad, Sexo, Celular, Email, Direccion, EstadoRegistro
    ) VALUES (
      1, 'Administrador', 'admin', ?, '12345678', 1, 30, 1, '987654321', 'admin@admin.com', 'Lima', 'Activo'
    )`;

    db.query(query, [hashedPassword], (err, result) => {
      if (err) {
        console.log("Error insertando usuario:", err.message);
      } else {
        console.log("¡Usuario administrador creado exitosamente!");
        console.log("Usuario: admin");
        console.log("Contraseña: admin123");
      }
      db.end();
    });
  });
});
