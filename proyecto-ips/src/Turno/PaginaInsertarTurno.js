import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const PaginaInsertarTurno = () => {
  const [turno, setTurno] = useState({
    IDRuta: "",
    IDHorario: "",
    IDBus: "",
    Codigo_Cargo: "",
  });
  const [buses, setBuses] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/buses`)
      .then((response) => response.json())
      .then((data) => setBuses(data))
      .catch((error) => console.error("Error al obtener los buses:", error));

    fetch(`http://localhost:3001/api/horarios`)
      .then((response) => response.json())
      .then((data) => setHorarios(data))
      .catch((error) => console.error("Error al obtener los horarios:", error));

    fetch(`http://localhost:3001/api/rutas`)
      .then((response) => response.json())
      .then((data) => setRutas(data))
      .catch((error) => console.error("Error al obtener las rutas:", error));

    fetch(`http://localhost:3001/api/usuarios`)
      .then((response) => response.json())
      .then((data) => {
        const conductoresFiltrados = data.filter(
          (usuario) => usuario.Codigo_Cargo === 3
        );
        setConductores(conductoresFiltrados);
      })
      .catch((error) =>
        console.error("Error al obtener los conductores:", error)
      );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTurno((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!turno.IDRuta || !turno.IDHorario || !turno.IDBus || !turno.Codigo_Cargo) {
      Swal.fire({
        icon: "warning",
        title: "Campos Incompletos",
        text: "Por favor, selecciona todos los elementos para crear el turno."
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:3001/api/insertarTurno`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(turno),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      Swal.fire({
        icon: "success",
        title: "¡Turno Creado!",
        text: "El viaje operativo ha sido programado exitosamente.",
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/GestionarTurno");
      }, 1500);
    } catch (error) {
      console.error("Error al insertar el turno:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudo registrar el turno: ${error.message}`
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />

      <div className="container py-4 px-3 px-md-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <button
            className="btn btn-link text-decoration-none text-muted p-0"
            onClick={() => navigate("/GestionarTurno")}
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Volver a Turnos
          </button>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="airova-card p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: "48px", height: "48px", background: "rgba(234, 88, 12, 0.1)", color: "#ea580c", fontSize: "1.3rem" }}
                >
                  <i className="fa-solid fa-calendar-plus"></i>
                </div>
                <div>
                  <h2 className="h4 fw-bold text-dark mb-0">Programar Nuevo Turno</h2>
                  <p className="text-muted small mb-0">Asocia una ruta, horario, bus y chofer en una sola asignación de viaje</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Bus Asignado <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="IDBus"
                      value={turno.IDBus}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un bus...</option>
                      {buses.map((bus) => (
                        <option key={bus.IDBus} value={bus.IDBus}>
                          {bus.Placa} ({bus.Modelo}) - {bus.Num_Asientos} asientos
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Conductor <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="Codigo_Cargo"
                      value={turno.Codigo_Cargo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un conductor...</option>
                      {conductores.map((conductor) => (
                        <option
                          key={conductor.Codigo_Usuario}
                          value={conductor.Codigo_Usuario}
                        >
                          {conductor.Nombre} (DNI: {conductor.DNI})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary small">
                      Ruta del Trayecto <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="IDRuta"
                      value={turno.IDRuta}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona una ruta...</option>
                      {rutas.map((ruta) => (
                        <option key={ruta.IDRuta} value={ruta.IDRuta}>
                          {ruta.PuntoSalida} ➔ {ruta.PuntoLlegada}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary small">
                      Itinerario / Horario <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="IDHorario"
                      value={turno.IDHorario}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un horario...</option>
                      {horarios.map((horario) => (
                        <option key={horario.IDHorario} value={horario.IDHorario}>
                          Fecha: {horario.Fecha} | Salida: {horario.Hora_Salida} - Llegada: {horario.Hora_Llegada}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate("/GestionarTurno")}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-airova-primary px-4 d-flex align-items-center gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i> Guardando...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk"></i> Crear Turno
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaInsertarTurno;