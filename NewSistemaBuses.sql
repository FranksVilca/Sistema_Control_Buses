-- Crear tabla para Turno
CREATE TABLE Trabajador (
    Codigo_Trabajador INT PRIMARY KEY,
    Nombre VARCHAR(100),
    Nombre_Usuario VARCHAR(100),
    Contraselas VARCHAR(100),
    DNI VARCHAR(100),
    Cargo VARCHAR(100),
    Edad INT,
    Sexo Boolean,
    Celular INT,
    Email VARCHAR(100),
    Direccion VARCHAR(100),
    EstadoRegistro VARCHAR(100),
);

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
    PuntoLlegada VARCHAR(100),
);

-- Crear tabla para Horario
CREATE TABLE Horario (
    IDHorario INT PRIMARY KEY,
    Fecha Time,
    Hora_salida TIME,
    Hora_Llegada TIME
);

-- Crear tabla para Bus
CREATE TABLE Bus (
    IDBus INT PRIMARY KEY,
    Num_Asientos INT,
    Estado Registro VARCHAR(100),
    Modelo VARCHAR(100),
    Marca VARCHAR(100),
    Placa VARCHAR(100)
);

-- Crear tabla para Reporte
CREATE TABLE Reporte (
    Encargado_de_reporte VARCHAR(100),
    FechaDia INT,
    FechaMes INT,
    FechaAño INT,
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
