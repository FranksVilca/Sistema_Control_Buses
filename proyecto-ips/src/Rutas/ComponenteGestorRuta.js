import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 10;

const ComponenteGestorRutas = () => {
  const [rutas, setRutas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSalida, setFilterSalida] = useState("todos");
  const [filterLlegada, setFilterLlegada] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRutas();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterSalida, filterLlegada]);

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

  const salidasUnicas = Array.from(
    new Set(rutas.map((r) => r.PuntoSalida).filter(Boolean))
  ).sort();

  const llegadasUnicas = Array.from(
    new Set(rutas.map((r) => r.PuntoLlegada).filter(Boolean))
  ).sort();

  const filteredRutas = rutas.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      (r.PuntoSalida && r.PuntoSalida.toLowerCase().includes(term)) ||
      (r.PuntoLlegada && r.PuntoLlegada.toLowerCase().includes(term)) ||
      (r.IDRuta && r.IDRuta.toString().includes(term));

    const matchesSalida =
      filterSalida === "todos" || r.PuntoSalida === filterSalida;

    const matchesLlegada =
      filterLlegada === "todos" || r.PuntoLlegada === filterLlegada;

    return matchesSearch && matchesSalida && matchesLlegada;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRutas.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRutas = filteredRutas.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const hasActiveFilters =
    searchTerm !== "" || filterSalida !== "todos" || filterLlegada !== "todos";

  const clearFilters = () => {
    setSearchTerm("");
    setFilterSalida("todos");
    setFilterLlegada("todos");
    setCurrentPage(1);
  };

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
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-secondary mb-1">
                <i className="fa-solid fa-magnifying-glass me-1"></i> Búsqueda rápida
              </label>
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
                    className="btn btn-outline-secondary border-start-0"
                    type="button"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                <i className="fa-solid fa-location-dot me-1"></i> Punto de Salida
              </label>
              <select
                className="form-select"
                value={filterSalida}
                onChange={(e) => setFilterSalida(e.target.value)}
              >
                <option value="todos">Todos los orígenes</option>
                {salidasUnicas.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                <i className="fa-solid fa-flag-checkered me-1"></i> Punto de Llegada
              </label>
              <select
                className="form-select"
                value={filterLlegada}
                onChange={(e) => setFilterLlegada(e.target.value)}
              >
                <option value="todos">Todos los destinos</option>
                {llegadasUnicas.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-2 d-flex justify-content-md-end">
              {hasActiveFilters ? (
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-1"
                  onClick={clearFilters}
                >
                  <i className="fa-solid fa-filter-circle-xmark"></i> Limpiar
                </button>
              ) : (
                <div className="text-md-end text-muted small w-100 py-2">
                  <strong>{filteredRutas.length}</strong> rutas
                </div>
              )}
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
                {hasActiveFilters ? "No hay rutas que coincidan con los filtros seleccionados." : "Aún no hay rutas registradas en el sistema."}
              </p>
              {hasActiveFilters ? (
                <button
                  className="btn btn-outline-secondary btn-sm mt-2"
                  onClick={clearFilters}
                >
                  <i className="fa-solid fa-rotate-left me-1"></i> Restablecer Filtros
                </button>
              ) : (
                <button
                  className="btn btn-airova-primary btn-sm mt-2"
                  onClick={() => navigate("/PaginaInsertarRuta")}
                >
                  <i className="fa-solid fa-plus me-1"></i> Crear Primera Ruta
                </button>
              )}
            </div>
          ) : (
            <>
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
                    {paginatedRutas.map((r) => (
                      <tr key={r.IDRuta}>
                        <td className="ps-4 fw-bold text-secondary">#{r.IDRuta}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
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

              <Pagination
                currentPage={safePage}
                totalItems={filteredRutas.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                itemLabel="rutas"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponenteGestorRutas;
