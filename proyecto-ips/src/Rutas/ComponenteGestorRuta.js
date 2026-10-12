import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const ComponenteGestorRutas = () => {
  const [rutas, setRutas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRutas();
  }, []);

  const fetchRutas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/rutas");
      if (!response.ok) {
        throw new Error("Error al obtener las rutas");
      }
      const data = await response.json();
      setRutas(data);
    } catch (error) {
      console.error("Error al obtener la lista de rutas:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la lista de rutas."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (IDRuta, nombreRuta) => {
    const result = await Swal.fire({
      title: "¿Eliminar esta ruta?",
      text: `¿Estás seguro de eliminar la ruta #${IDRuta} (${nombreRuta})?`,
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
          `http://localhost:3001/api/ruta/${IDRuta}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Error al eliminar la ruta");
        }
        Swal.fire({
          icon: "success",
          title: "Eliminada",
          text: "La ruta fue eliminada exitosamente.",
          timer: 1500,
          showConfirmButton: false
        });
        fetchRutas();
      } catch (error) {
        console.error("Error al eliminar la ruta:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la ruta."
        });
      }
    }
  };

  const handleEdit = (IDRuta) => {
    navigate(`/PaginaEdicionRuta/${IDRuta}`);
  };

  const filteredRutas = rutas.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      (r.PuntoSalida && r.PuntoSalida.toLowerCase().includes(term)) ||
      (r.PuntoLlegada && r.PuntoLlegada.toLowerCase().includes(term)) ||
      (r.IDRuta && r.IDRuta.toString().includes(term))
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
              <span className="badge bg-info bg-opacity-10 text-info px-2 py-1 rounded">
                <i className="fa-solid fa-route me-1"></i> Red de Trayectos
              </span>
              <span className="text-muted small">• Total: {rutas.length} rutas</span>
            </div>
            <h1 className="h3 fw-bold text-dark mb-0">Gestión de Rutas</h1>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-airova-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/PaginaInsertarRuta")}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Nueva Ruta</span>
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
                  placeholder="Buscar por origen, destino o ID..."
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
              Mostrando {filteredRutas.length} de {rutas.length} rutas
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="airova-card overflow-hidden">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2 mb-0">Cargando rutas...</p>
            </div>
          ) : filteredRutas.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 text-muted mb-2">
                <i className="fa-solid fa-map-location-dot opacity-50"></i>
              </div>
              <h5 className="fw-semibold text-secondary">No se encontraron rutas</h5>
              <p className="text-muted small">
                {searchTerm ? "Prueba con otro origen o destino." : "Aún no hay rutas registradas en el sistema."}
              </p>
              {!searchTerm && (
                <button
                  className="btn btn-airova-primary btn-sm mt-2"
                  onClick={() => navigate("/PaginaInsertarRuta")}
                >
                  <i className="fa-solid fa-plus me-1"></i> Crear Primera Ruta
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="ps-4 text-secondary text-uppercase fs-7 fw-semibold">ID</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Punto de Salida</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold text-center">Trayecto</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Punto de Llegada</th>
                    <th className="pe-4 text-secondary text-uppercase fs-7 fw-semibold text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRutas.map((r) => (
                    <tr key={r.IDRuta}>
                      <td className="ps-4 fw-bold text-secondary">#{r.IDRuta}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-success bg-opacity-10 text-success p-2 rounded-circle">
                            <i className="fa-solid fa-location-dot"></i>
                          </span>
                          <span className="fw-semibold text-dark">{r.PuntoSalida}</span>
                        </div>
                      </td>
                      <td className="text-center text-muted">
                        <i className="fa-solid fa-arrow-right-long text-primary"></i>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-danger bg-opacity-10 text-danger p-2 rounded-circle">
                            <i className="fa-solid fa-flag-checkered"></i>
                          </span>
                          <span className="fw-semibold text-dark">{r.PuntoLlegada}</span>
                        </div>
                      </td>
                      <td className="pe-4 text-end">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(r.IDRuta)}
                            title="Editar ruta"
                          >
                            <i className="fa-solid fa-pen-to-square me-1"></i> Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(r.IDRuta, `${r.PuntoSalida} - ${r.PuntoLlegada}`)}
                            title="Eliminar ruta"
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

export default ComponenteGestorRutas;
