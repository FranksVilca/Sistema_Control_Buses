import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const ComponenteGestorHorarios = () => {
  const [horarios, setHorarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/horarios");
      if (!response.ok) {
        throw new Error("Error al obtener los horarios");
      }
      const data = await response.json();
      setHorarios(data);
    } catch (error) {
      console.error("Error al obtener la lista de horarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la lista de horarios."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idHorario) => {
    const result = await Swal.fire({
      title: "¿Eliminar este horario?",
      text: `¿Estás seguro de eliminar el horario #${idHorario}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/delete/horario/${idHorario}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Error al eliminar el horario");
        }
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El horario fue eliminado exitosamente.",
          timer: 1500,
          showConfirmButton: false
        });
        fetchHorarios();
      } catch (error) {
        console.error("Error al eliminar el horario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el horario."
        });
      }
    }
  };

  const handleEdit = (idHorario) => {
    navigate(`/PaginaEdicionHorarios/${idHorario}`);
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

  const filteredHorarios = horarios.filter((h) => {
    const term = searchTerm.toLowerCase();
    return (
      (h.Fecha && h.Fecha.toLowerCase().includes(term)) ||
      (h.Hora_Salida && h.Hora_Salida.toLowerCase().includes(term)) ||
      (h.Hora_Llegada && h.Hora_Llegada.toLowerCase().includes(term)) ||
      (h.IDHorario && h.IDHorario.toString().includes(term))
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
              <span className="badge bg-purple bg-opacity-10 text-primary px-2 py-1 rounded" style={{ background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed" }}>
                <i className="fa-solid fa-clock me-1"></i> Cronograma de Salidas
              </span>
              <span className="text-muted small">• Total: {horarios.length} horarios</span>
            </div>
            <h1 className="h3 fw-bold text-dark mb-0">Gestión de Horarios</h1>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-airova-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/PaginaInsertarHorarios")}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Nuevo Horario</span>
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
                  placeholder="Buscar por fecha, hora o ID..."
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
              Mostrando {filteredHorarios.length} de {horarios.length} horarios programados
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="airova-card overflow-hidden">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2 mb-0">Cargando itinerarios...</p>
            </div>
          ) : filteredHorarios.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 text-muted mb-2">
                <i className="fa-solid fa-calendar-xmark opacity-50"></i>
              </div>
              <h5 className="fw-semibold text-secondary">No se encontraron horarios</h5>
              <p className="text-muted small">
                {searchTerm ? "Prueba con otra fecha u hora." : "Aún no hay horarios registrados en el sistema."}
              </p>
              {!searchTerm && (
                <button
                  className="btn btn-airova-primary btn-sm mt-2"
                  onClick={() => navigate("/PaginaInsertarHorarios")}
                >
                  <i className="fa-solid fa-plus me-1"></i> Programar Primer Horario
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="ps-4 text-secondary text-uppercase fs-7 fw-semibold">ID</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Fecha Programada</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Hora de Salida</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Hora de Llegada</th>
                    <th className="pe-4 text-secondary text-uppercase fs-7 fw-semibold text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHorarios.map((h) => (
                    <tr key={h.IDHorario}>
                      <td className="ps-4 fw-bold text-secondary">#{h.IDHorario}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
                            <i className="fa-solid fa-calendar-day"></i>
                          </span>
                          <span className="fw-semibold text-dark">{formatDate(h.Fecha)}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 font-monospace">
                          <i className="fa-solid fa-clock me-1"></i> {h.Hora_Salida}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary px-2 py-1 font-monospace">
                          <i className="fa-solid fa-clock me-1"></i> {h.Hora_Llegada}
                        </span>
                      </td>
                      <td className="pe-4 text-end">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(h.IDHorario)}
                            title="Editar horario"
                          >
                            <i className="fa-solid fa-pen-to-square me-1"></i> Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(h.IDHorario)}
                            title="Eliminar horario"
                          >
                            <i className="fa-solid fa-trash-can"></i>
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

export default ComponenteGestorHorarios;
