
-- Crear tabla para Cargo
CREATE TABLE Cargo (
    Codigo_Cargo INT PRIMARY KEY,
    Descripcion VARCHAR(100) NOT NULL
);

-- Crear tabla para Usuario
CREATE TABLE Usuario (
    Codigo_Usuario INT PRIMARY KEY,
    Nombre VARCHAR(100),
    Nombre_Usuario VARCHAR(100),
    Contrasena VARCHAR(100),
    DNI VARCHAR(20),
    Codigo_Cargo INT,
    Edad INT,
    Sexo BOOLEAN,
    Celular VARCHAR(15),
    Email VARCHAR(100),
    Direccion VARCHAR(100),
    EstadoRegistro VARCHAR(1),
    FOREIGN KEY (Codigo_Cargo) REFERENCES Cargo(Codigo_Cargo)
);

-- Crear tabla para Turno
CREATE TABLE Turno (
    Codigo_Turno INT PRIMARY KEY,
    IDRuta INT,
    IDHorario INT,
    IDBus INT,
    IDChofer INT
);

-- Crear tabla para Ruta
CREATE TABLE Ruta (
    IDRuta INT PRIMARY KEY,
    PuntoSalida VARCHAR(100),
    PuntoLlegada VARCHAR(100)
);

-- Crear tabla para Horario
CREATE TABLE Horario (
    IDHorario INT PRIMARY KEY,
    Fecha DATE,
    Hora_Salida TIME,
    Hora_Llegada TIME
);

-- Crear tabla para Bus
CREATE TABLE Bus (
    IDBus INT PRIMARY KEY,
    Num_Asientos INT,
    EstadoRegistro VARCHAR(1),
    Modelo VARCHAR(100),
    Marca VARCHAR(100),
    Placa VARCHAR(10)
);

-- Crear tabla para Reporte
CREATE TABLE Reporte (
    Encargado_de_Reporte VARCHAR(100),
    Fecha DATE,
    Codigo_Turno INT,
    FOREIGN KEY (Codigo_Turno) REFERENCES Turno(Codigo_Turno)
);

-- Crear tablas de relación para Turno con Ruta, Horario, y Bus
CREATE TABLE Turno_Ruta (
    Codigo_Turno INT,
    IDRuta INT,
    FOREIGN KEY (Codigo_Turno) REFERENCES Turno(Codigo_Turno),
    FOREIGN KEY (IDRuta) REFERENCES Ruta(IDRuta)
);

CREATE TABLE Turno_Horario (
    Codigo_Turno INT,
    IDHorario INT,
    FOREIGN KEY (Codigo_Turno) REFERENCES Turno(Codigo_Turno),
    FOREIGN KEY (IDHorario) REFERENCES Horario(IDHorario)
);

CREATE TABLE Turno_Bus (
    Codigo_Turno INT,
    IDBus INT,
    FOREIGN KEY (Codigo_Turno) REFERENCES Turno(Codigo_Turno),
    FOREIGN KEY (IDBus) REFERENCES Bus(IDBus)
);

-- Crear tabla para Asistencia
CREATE TABLE Asistencia (
    Codigo_Asistencia INT AUTO_INCREMENT PRIMARY KEY,
    Codigo_Turno INT,
    Codigo_Usuario INT,
    Asistencia BOOLEAN,
    FOREIGN KEY (Codigo_Turno) REFERENCES Turno(Codigo_Turno),
    FOREIGN KEY (Codigo_Usuario) REFERENCES Usuario(Codigo_Usuario)
);
