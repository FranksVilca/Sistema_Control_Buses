import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const ComponenteGestorTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/turnos");
      if (!response.ok) {
        throw new Error("Error al obtener los turnos");
      }
      const data = await response.json();
      setTurnos(data);
    } catch (error) {
      console.error("Error al obtener la lista de turnos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la lista de turnos."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (codigoTurno) => {
    const result = await Swal.fire({
      title: "¿Inactivar turno?",
      text: `¿Estás seguro de marcar el turno #${codigoTurno} como inactivo?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, inactivar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/turnos/inactivar/${codigoTurno}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al marcar el turno como inactivo");
        }
        Swal.fire({
          icon: "success",
          title: "Inactivado",
          text: "El turno ha sido marcado como inactivo.",
          timer: 1500,
          showConfirmButton: false
        });
        fetchData();
      } catch (error) {
        console.error("Error al inactivar el turno:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo inactivar el turno."
        });
      }
    }
  };

  const handleAssign = (codigoTurno, numAsientos) => {
    navigate(`/asignarTurno/${codigoTurno}/${numAsientos}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-PE", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const filteredTurnos = turnos.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      (t.PuntoSalida && t.PuntoSalida.toLowerCase().includes(term)) ||
      (t.PuntoLlegada && t.PuntoLlegada.toLowerCase().includes(term)) ||
      (t.Placa && t.Placa.toLowerCase().includes(term)) ||
      (t.Codigo_Turno && t.Codigo_Turno.toString().includes(term))
    );
  });

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />

      <div className="container py-4 px-3 px-md-4">
        {/* Header bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-warning bg-opacity-10 text-dark px-2 py-1 rounded" style={{ background: "rgba(234, 88, 12, 0.1)", color: "#ea580c" }}>
                <i className="fa-solid fa-calendar-check me-1"></i> Asignación de Viajes
              </span>
              <span className="text-muted small">• Total: {turnos.length} turnos activos</span>
            </div>
            <h1 className="h3 fw-bold text-dark mb-0">Gestión de Turnos</h1>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-airova-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/InsertarTurno")}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Programar Turno</span>
            </button>
          </div>
        </div>

        {/* Filter Card */}
        <div className="airova-card p-3 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Buscar por ruta, placa o código de turno..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary border-start-0 border-end-0"
                    type="button"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-12 col-md-6 text-md-end text-muted small">
              Mostrando {filteredTurnos.length} de {turnos.length} turnos activos
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="airova-card overflow-hidden">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2 mb-0">Cargando turnos operativos...</p>
            </div>
          ) : filteredTurnos.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 text-muted mb-2">
                <i className="fa-solid fa-calendar-xmark opacity-50"></i>
              </div>
              <h5 className="fw-semibold text-secondary">No se encontraron turnos</h5>
              <p className="text-muted small">
                {searchTerm ? "Prueba con otro término de búsqueda." : "Aún no hay turnos activos programados."}
              </p>
              {!searchTerm && (
                <button
                  className="btn btn-airova-primary btn-sm mt-2"
                  onClick={() => navigate("/InsertarTurno")}
                >
                  <i className="fa-solid fa-plus me-1"></i> Crear Primer Turno
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="ps-4 text-secondary text-uppercase fs-7 fw-semibold">Turno</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Trayecto (Ruta)</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Itinerario</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Unidad de Bus</th>
                    <th className="pe-4 text-secondary text-uppercase fs-7 fw-semibold text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTurnos.map((turno) => (
                    <tr key={turno.Codigo_Turno}>
                      <td className="ps-4 fw-bold text-secondary">#{turno.Codigo_Turno}</td>
                      <td>
                        <div className="fw-semibold text-dark">
                          {turno.PuntoSalida} <i className="fa-solid fa-arrow-right text-primary mx-1 small"></i> {turno.PuntoLlegada}
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          <div><i className="fa-solid fa-calendar text-muted me-1"></i>{formatDate(turno.Fecha)}</div>
                          <div className="text-muted font-monospace">{turno.Hora_Salida} - {turno.Hora_Llegada}</div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-dark bg-opacity-10 text-dark font-monospace fw-bold">
                            {turno.Placa}
                          </span>
                          <span className="badge bg-secondary bg-opacity-10 text-secondary">
                            <i className="fa-solid fa-chair me-1"></i> {turno.Num_Asientos} asientos
                          </span>
                        </div>
                      </td>
                      <td className="pe-4 text-end">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleAssign(turno.Codigo_Turno, turno.Num_Asientos)}
                            title="Asignar turno a pasajeros / personal"
                          >
                            <i className="fa-solid fa-user-check me-1"></i> Asignar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning text-dark"
                            onClick={() => handleDelete(turno.Codigo_Turno)}
                            title="Inactivar turno"
                          >
                            <i className="fa-solid fa-ban me-1"></i> Inactivar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponenteGestorTurnos;
