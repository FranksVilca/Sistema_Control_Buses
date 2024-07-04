-- Crear tabla para Turno
CREATE TABLE Turno (
    Codigo_Turno INT PRIMARY KEY
);

-- Crear tabla para Ruta
CREATE TABLE Ruta (
    IDRuta INT PRIMARY KEY,
    Distancia INT,
    PuntoSalida VARCHAR(100),
    PuntoLlegada VARCHAR(100)
);

-- Crear tabla para Horario
CREATE TABLE Horario (
    IDHorario INT PRIMARY KEY,
    Hora_salida TIME,
    Hora_Llegada TIME
);

-- Crear tabla para Bus
CREATE TABLE Bus (
    IDBus INT PRIMARY KEY,
    Chofer VARCHAR(100),
    Asiento INT,
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
