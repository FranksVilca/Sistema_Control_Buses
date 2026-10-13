import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import IdBadge, { formatId } from "../components/IdBadge";
import DetailModal from "../components/DetailModal";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 10;

const ComponenteGestorBuses = () => {
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterMarca, setFilterMarca] = useState("todas");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuses();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterEstado, filterMarca]);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/buses");
      if (!response.ok) {
        throw new Error("Error al obtener los buses");
      }
      const data = await response.json();
      setBuses(data);
    } catch (error) {
      console.error("Error al obtener la lista de buses:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la lista de buses. Verifica la conexión con el servidor."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idBus, placa) => {
    const result = await Swal.fire({
      title: "¿Eliminar este bus?",
      text: `¿Estás seguro de eliminar el bus ${formatId(idBus, "BUS")} (${placa || ""})? Esta acción no se puede deshacer.`,
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
          `http://localhost:3001/api/delete/bus/${idBus}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Error al eliminar el bus");
        }
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El bus ha sido eliminado exitosamente.",
          timer: 1500,
          showConfirmButton: false
        });
        fetchBuses();
      } catch (error) {
        console.error("Error al eliminar el bus:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el bus."
        });
      }
    }
  };

  const handleEdit = (idBus) => {
    sessionStorage.setItem("airova_edit_bus_id", idBus);
    navigate("/PaginaEdicionBus", { state: { idBus } });
  };

  const marcasUnicas = Array.from(
    new Set(buses.map((b) => b.Marca).filter(Boolean))
  ).sort();

  const filteredBuses = buses.filter((bus) => {
    const term = searchTerm.toLowerCase();
    const formattedCode = formatId(bus.IDBus, "BUS").toLowerCase();
    const matchesSearch =
      !term ||
      (bus.Placa && bus.Placa.toLowerCase().includes(term)) ||
      (bus.Modelo && bus.Modelo.toLowerCase().includes(term)) ||
      (bus.Marca && bus.Marca.toLowerCase().includes(term)) ||
      (bus.IDBus && bus.IDBus.toString().includes(term)) ||
      formattedCode.includes(term);

    const estadoBus = (bus.EstadoRegistro || "").toLowerCase();
    const matchesEstado =
      filterEstado === "todos" ||
      (filterEstado === "activo" && estadoBus.includes("activo") && !estadoBus.includes("inactivo")) ||
      (filterEstado === "mantenimiento" && estadoBus.includes("mantenimiento")) ||
      (filterEstado === "inactivo" && estadoBus.includes("inactivo"));

    const matchesMarca =
      filterMarca === "todas" || bus.Marca === filterMarca;

    return matchesSearch && matchesEstado && matchesMarca;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBuses.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBuses = filteredBuses.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const hasActiveFilters =
    searchTerm !== "" || filterEstado !== "todos" || filterMarca !== "todas";

  const clearFilters = () => {
    setSearchTerm("");
    setFilterEstado("todos");
    setFilterMarca("todas");
    setCurrentPage(1);
  };

  const getStatusBadge = (estado) => {
    const val = (estado || "").toLowerCase();
    if (val.includes("activo") && !val.includes("inactivo")) {
      return <span className="badge-status badge-status-activo"><i className="fa-solid fa-circle-check"></i> Activo</span>;
    }
    if (val.includes("mantenimiento")) {
      return <span className="badge-status badge-status-mantenimiento"><i className="fa-solid fa-wrench"></i> Mantenimiento</span>;
    }
    return <span className="badge-status badge-status-inactivo"><i className="fa-solid fa-circle-xmark"></i> Inactivo</span>;
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />

      <div className="container py-4 px-3 px-md-4">
        {/* Header bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
                <i className="fa-solid fa-bus me-1"></i> Flota Vehicular
              </span>
              <span className="text-muted small">• Total: {buses.length} buses</span>
            </div>
            <h1 className="h3 fw-bold text-dark mb-0">Gestión de Buses</h1>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-airova-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/InsertarBus")}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Registrar Bus</span>
            </button>
          </div>
        </div>

        {/* Filter Card */}
        <div className="airova-card p-3 mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-5">
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
                  placeholder="Buscar por código (BUS-001), placa, modelo o marca..."
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
                <i className="fa-solid fa-filter me-1"></i> Estado
              </label>
              <select
                className="form-select"
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="mantenimiento">En Mantenimiento</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold text-secondary mb-1">
                <i className="fa-solid fa-tag me-1"></i> Marca
              </label>
              <select
                className="form-select"
                value={filterMarca}
                onChange={(e) => setFilterMarca(e.target.value)}
              >
                <option value="todas">Todas</option>
                {marcasUnicas.map((marca) => (
                  <option key={marca} value={marca}>
                    {marca}
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
                  <strong>{filteredBuses.length}</strong> resultados
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="airova-card overflow-hidden">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted mt-2 mb-0">Cargando unidades vehiculares...</p>
            </div>
          ) : filteredBuses.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 text-muted mb-2">
                <i className="fa-solid fa-bus-simple opacity-50"></i>
              </div>
              <h5 className="fw-semibold text-secondary">No se encontraron buses</h5>
              <p className="text-muted small">
                {hasActiveFilters ? "No hay coincidencias con los filtros aplicados." : "Aún no hay buses registrados en el sistema."}
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
                  onClick={() => navigate("/InsertarBus")}
                >
                  <i className="fa-solid fa-plus me-1"></i> Registrar Primer Bus
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
                      <th className="text-secondary text-uppercase fs-7 fw-semibold">Placa</th>
                      <th className="text-secondary text-uppercase fs-7 fw-semibold">Marca / Modelo</th>
                      <th className="text-secondary text-uppercase fs-7 fw-semibold text-center">Asientos</th>
                      <th className="text-secondary text-uppercase fs-7 fw-semibold">Estado</th>
                      <th className="pe-4 text-secondary text-uppercase fs-7 fw-semibold text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBuses.map((bus) => (
                      <tr key={bus.IDBus}>
                        <td className="ps-4">
                          <IdBadge prefix="BUS" id={bus.IDBus} />
                        </td>
                        <td>
                          <span className="badge bg-dark bg-opacity-10 text-dark px-2 py-1 font-monospace fw-bold fs-7">
                            {bus.Placa}
                          </span>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{bus.Modelo}</div>
                          <div className="text-muted small">{bus.Marca}</div>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-secondary bg-opacity-10 text-secondary px-2 py-1">
                            <i className="fa-solid fa-chair me-1"></i> {bus.Num_Asientos}
                          </span>
                        </td>
                        <td>{getStatusBadge(bus.EstadoRegistro)}</td>
                        <td className="pe-4 text-end">
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => setSelectedBus(bus)}
                              title="Ver detalle del bus"
                            >
                              <i className="fa-solid fa-eye me-1"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(bus.IDBus)}
                              title="Editar bus"
                            >
                              <i className="fa-solid fa-pen-to-square me-1"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(bus.IDBus, bus.Placa)}
                              title="Eliminar bus"
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
                totalItems={filteredBuses.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                itemLabel="unidades"
              />
            </>
          )}
        </div>
      </div>

      {/* Modal de Vista Detalle */}
      <DetailModal
        isOpen={Boolean(selectedBus)}
        onClose={() => setSelectedBus(null)}
        title={selectedBus ? `${selectedBus.Marca || "Unidad"} ${selectedBus.Modelo || ""}` : "Detalle de Bus"}
        subtitle="Ficha técnica e información operativa de la unidad vehicular"
        icon="fa-bus"
        idBadge={selectedBus ? { prefix: "BUS", id: selectedBus.IDBus } : null}
        statusBadge={selectedBus ? getStatusBadge(selectedBus.EstadoRegistro) : null}
        fields={
          selectedBus
            ? [
                {
                  label: "Código de Unidad",
                  value: formatId(selectedBus.IDBus, "BUS"),
                  icon: "fa-hashtag",
                },
                {
                  label: "Placa de Rodaje",
                  value: (
                    <span className="badge bg-dark bg-opacity-10 text-dark px-2 py-1 font-monospace fw-bold">
                      {selectedBus.Placa || "Sin Placa"}
                    </span>
                  ),
                  icon: "fa-id-card",
                },
                {
                  label: "Marca del Fabricante",
                  value: selectedBus.Marca,
                  icon: "fa-industry",
                },
                {
                  label: "Modelo",
                  value: selectedBus.Modelo,
                  icon: "fa-bus-simple",
                },
                {
                  label: "Capacidad de Pasajeros",
                  value: `${selectedBus.Num_Asientos || 0} asientos disponibles`,
                  icon: "fa-chair",
                },
                {
                  label: "Estado de Registro",
                  value: selectedBus.EstadoRegistro || "Activo",
                  icon: "fa-circle-check",
                },
              ]
            : []
        }
        primaryAction={
          selectedBus
            ? {
                label: "Editar Unidad",
                icon: "fa-pen-to-square",
                onClick: () => {
                  const id = selectedBus.IDBus;
                  setSelectedBus(null);
                  handleEdit(id);
                },
              }
            : null
        }
      />
    </div>
  );
};

export default ComponenteGestorBuses;
