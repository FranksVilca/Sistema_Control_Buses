# ============================================
# Base de Datos: airova
# Sistema de Control de Buses
# ============================================

-- Usar la base de datos
USE airova;

-- ============================================
-- Tabla: Cargo
-- ============================================
CREATE TABLE IF NOT EXISTS Cargo (
    Codigo_Cargo INT PRIMARY KEY,
    Descripcion VARCHAR(100) NOT NULL
);

-- ============================================
-- Tabla: Usuario
-- ============================================
CREATE TABLE IF NOT EXISTS Usuario (
    Codigo_Usuario INT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Nombre_Usuario VARCHAR(100) NOT NULL UNIQUE,
    Contrasena VARCHAR(255) NOT NULL,
    DNI VARCHAR(20),
    Codigo_Cargo INT NOT NULL,
    Edad INT,
    Sexo VARCHAR(20),
    Celular VARCHAR(20),
    Email VARCHAR(255),
    Direccion VARCHAR(255),
    EstadoRegistro VARCHAR(20) DEFAULT 'Activo',
    img LONGBLOB,
    FOREIGN KEY (Codigo_Cargo) REFERENCES Cargo(Codigo_Cargo)
);

-- ============================================
-- Tabla: Bus
-- ============================================
CREATE TABLE IF NOT EXISTS Bus (
    IDBus INT PRIMARY KEY,
    Num_Asientos INT NOT NULL,
    EstadoRegistro VARCHAR(20) DEFAULT 'Activo',
    Modelo VARCHAR(100),
    Marca VARCHAR(100),
    Placa VARCHAR(20) UNIQUE
);

-- ============================================
-- Tabla: Horario
-- ============================================
CREATE TABLE IF NOT EXISTS Horario (
    IDHorario INT PRIMARY KEY,
    Fecha DATE NOT NULL,
    Hora_Salida TIME,
    Hora_Llegada TIME
);

-- ============================================
-- Tabla: Ruta
-- ============================================
CREATE TABLE IF NOT EXISTS Ruta (
    IDRuta INT PRIMARY KEY,
    PuntoSalida VARCHAR(255) NOT NULL,
    PuntoLlegada VARCHAR(255) NOT NULL
);

-- ============================================
-- Tabla: Turno
-- ============================================
CREATE TABLE IF NOT EXISTS Turno (
    Codigo_Turno INT PRIMARY KEY,
    IDRuta INT,
    IDHorario INT,
    IDBus INT,
    IDChofer INT,
    Activo TINYINT DEFAULT 1,
    FOREIGN KEY (IDRuta) REFERENCES Ruta(IDRuta),
    FOREIGN KEY (IDHorario) REFERENCES Horario(IDHorario),
    FOREIGN KEY (IDBus) REFERENCES Bus(IDBus),
    FOREIGN KEY (IDChofer) REFERENCES Usuario(Codigo_Usuario)
);

-- ============================================
-- Tabla: Asistencia
-- ============================================
CREATE TABLE IF NOT EXISTS Asistencia (
    Codigo_Asistencia INT AUTO_INCREMENT PRIMARY KEY,
    Codigo_Turno INT NOT NULL,
    Codigo_Usuario INT NOT NULL,
    Asistencia TINYINT DEFAULT 0,
    FOREIGN KEY (Codigo_Turno) REFERENCES Turno(Codigo_Turno),
    FOREIGN KEY (Codigo_Usuario) REFERENCES Usuario(Codigo_Usuario)
);

-- ============================================
-- Vista: vistaturnos
-- ============================================
CREATE OR REPLACE VIEW vistaturnos AS
SELECT
    t.Codigo_Turno,
    t.IDRuta,
    r.PuntoSalida,
    r.PuntoLlegada,
    t.IDHorario,
    h.Fecha,
    h.Hora_Salida,
    h.Hora_Llegada,
    t.IDBus,
    b.Placa,
    b.Num_Asientos,
    t.IDChofer,
    u.Nombre AS NombreChofer,
    t.Activo
FROM Turno t
LEFT JOIN Ruta r ON t.IDRuta = r.IDRuta
LEFT JOIN Horario h ON t.IDHorario = h.IDHorario
LEFT JOIN Bus b ON t.IDBus = b.IDBus
LEFT JOIN Usuario u ON t.IDChofer = u.Codigo_Usuario;

-- ============================================
-- Datos iniciales: Cargos
-- ============================================
INSERT INTO Cargo (Codigo_Cargo, Descripcion) VALUES
    (1, 'Administrador'),
    (2, 'Trabajador'),
    (3, 'Chofer')
ON DUPLICATE KEY UPDATE Descripcion = VALUES(Descripcion);

-- ============================================
-- Usuario Admin por defecto
-- Credenciales:
--   Usuario: admin
--   Contraseña: admin123
-- ============================================
-- Contraseña 'admin123' hasheada con bcryptjs (10 rounds)
INSERT INTO Usuario (
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
    EstadoRegistro
) VALUES (
    1,
    'Administrador del Sistema',
    'admin',
    '$2a$10$DVzyoHmYBdmAQteXJ9qER.8BSPNSiBoZ6zabjRKaFiBAQtryRGn2C',
    '00000000',
    1,
    30,
    'Masculino',
    '000000000',
    'admin@airova.com',
    'Oficina Central',
    'Activo'
) ON DUPLICATE KEY UPDATE Codigo_Usuario = Codigo_Usuario;
