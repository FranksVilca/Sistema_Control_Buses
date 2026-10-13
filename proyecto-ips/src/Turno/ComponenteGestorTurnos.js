import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import IdBadge, { formatId } from "../components/IdBadge";
import DetailModal from "../components/DetailModal";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 10;

const ComponenteGestorTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRuta, setFilterRuta] = useState("todas");
  const [filterPlaca, setFilterPlaca] = useState("todas");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRuta, filterPlaca]);

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
      text: `¿Estás seguro de marcar el turno ${formatId(codigoTurno, "TRN")} como inactivo?`,
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
    sessionStorage.setItem("airova_assign_turno_id", codigoTurno);
    sessionStorage.setItem("airova_assign_asientos", numAsientos);
    navigate("/asignarTurno", { state: { codigoTurno, numAsientos } });
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

  const rutasUnicas = Array.from(
    new Set(
      turnos
        .filter((t) => t.PuntoSalida && t.PuntoLlegada)
        .map((t) => `${t.PuntoSalida} - ${t.PuntoLlegada}`)
    )
  ).sort();

  const placasUnicas = Array.from(
    new Set(turnos.map((t) => t.Placa).filter(Boolean))
  ).sort();

  const filteredTurnos = turnos.filter((t) => {
    const term = searchTerm.toLowerCase();
    const formattedCode = formatId(t.Codigo_Turno, "TRN").toLowerCase();
    const matchesSearch =
      !term ||
      (t.PuntoSalida && t.PuntoSalida.toLowerCase().includes(term)) ||
      (t.PuntoLlegada && t.PuntoLlegada.toLowerCase().includes(term)) ||
      (t.Placa && t.Placa.toLowerCase().includes(term)) ||
      (t.Codigo_Turno && t.Codigo_Turno.toString().includes(term)) ||
      formattedCode.includes(term);

    const rutaNombre = `${t.PuntoSalida} - ${t.PuntoLlegada}`;
    const matchesRuta = filterRuta === "todas" || rutaNombre === filterRuta;
    const matchesPlaca = filterPlaca === "todas" || t.Placa === filterPlaca;

    return matchesSearch && matchesRuta && matchesPlaca;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTurnos.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTurnos = filteredTurnos.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const hasActiveFilters =
    searchTerm !== "" || filterRuta !== "todas" || filterPlaca !== "todas";

  const clearFilters = () => {
    setSearchTerm("");
    setFilterRuta("todas");
    setFilterPlaca("todas");
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
              <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
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
                  placeholder="Buscar por código (TRN-001), ruta o placa..."
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
                <i className="fa-solid fa-route me-1"></i> Trayecto / Ruta
              </label>
              <select
                className="form-select"
                value={filterRuta}
                onChange={(e) => setFilterRuta(e.target.value)}
              >
                <option value="todas">Todas las rutas</option>
                {rutasUnicas.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                <i className="fa-solid fa-bus me-1"></i> Unidad (Placa)
              </label>
              <select
                className="form-select"
                value={filterPlaca}
                onChange={(e) => setFilterPlaca(e.target.value)}
              >
                <option value="todas">Todas las unidades</option>
                {placasUnicas.map((p) => (
                  <option key={p} value={p}>
                    {p}
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
                  <strong>{filteredTurnos.length}</strong> turnos
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
              <p className="text-muted mt-2 mb-0">Cargando turnos operativos...</p>
            </div>
          ) : filteredTurnos.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 text-muted mb-2">
                <i className="fa-solid fa-calendar-xmark opacity-50"></i>
              </div>
              <h5 className="fw-semibold text-secondary">No se encontraron turnos</h5>
              <p className="text-muted small">
                {hasActiveFilters ? "No hay turnos que coincidan con los filtros seleccionados." : "Aún no hay turnos activos programados."}
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
                  onClick={() => navigate("/InsertarTurno")}
                >
                  <i className="fa-solid fa-plus me-1"></i> Crear Primer Turno
                </button>
              )}
            </div>
          ) : (
            <>
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
                    {paginatedTurnos.map((turno) => (
                      <tr key={turno.Codigo_Turno}>
                        <td className="ps-4">
                          <IdBadge prefix="TRN" id={turno.Codigo_Turno} />
                        </td>
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
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => setSelectedTurno(turno)}
                              title="Ver detalle del turno"
                            >
                              <i className="fa-solid fa-eye me-1"></i> Detalle
                            </button>
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

              <Pagination
                currentPage={safePage}
                totalItems={filteredTurnos.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                itemLabel="turnos"
              />
            </>
          )}
        </div>
      </div>

      {/* Modal de Vista Detalle */}
      <DetailModal
        isOpen={Boolean(selectedTurno)}
        onClose={() => setSelectedTurno(null)}
        title={
          selectedTurno
            ? `${selectedTurno.PuntoSalida} → ${selectedTurno.PuntoLlegada}`
            : "Detalle de Turno"
        }
        subtitle="Información de viaje, bus asignado e itinerario operativo"
        icon="fa-calendar-days"
        idBadge={
          selectedTurno
            ? { prefix: "TRN", id: selectedTurno.Codigo_Turno }
            : null
        }
        statusBadge={
          <span className="badge-status badge-status-activo">
            <i className="fa-solid fa-circle-check"></i> Turno Activo
          </span>
        }
        fields={
          selectedTurno
            ? [
                {
                  label: "Código de Turno",
                  value: formatId(selectedTurno.Codigo_Turno, "TRN"),
                  icon: "fa-hashtag",
                },
                {
                  label: "Fecha de Viaje",
                  value: formatDate(selectedTurno.Fecha),
                  icon: "fa-calendar-day",
                },
                {
                  label: "Punto de Salida (Origen)",
                  value: selectedTurno.PuntoSalida,
                  icon: "fa-location-dot",
                },
                {
                  label: "Punto de Llegada (Destino)",
                  value: selectedTurno.PuntoLlegada,
                  icon: "fa-flag-checkered",
                },
                {
                  label: "Horario (Salida - Llegada)",
                  value: `${selectedTurno.Hora_Salida || "-"} - ${
                    selectedTurno.Hora_Llegada || "-"
                  }`,
                  icon: "fa-clock",
                },
                {
                  label: "Unidad de Bus y Capacidad",
                  value: `${selectedTurno.Placa || "Sin placa"} (${
                    selectedTurno.Num_Asientos || 0
                  } asientos)`,
                  icon: "fa-bus",
                },
              ]
            : []
        }
        secondaryAction={
          selectedTurno
            ? {
                label: "Ver Asistencia",
                icon: "fa-clipboard-check",
                onClick: () => {
                  const id = selectedTurno.Codigo_Turno;
                  setSelectedTurno(null);
                  navigate("/Asistencia", { state: { codigoTurno: id } });
                },
              }
            : null
        }
        primaryAction={
          selectedTurno
            ? {
                label: "Asignar Pasajeros",
                icon: "fa-user-check",
                onClick: () => {
                  const id = selectedTurno.Codigo_Turno;
                  const seats = selectedTurno.Num_Asientos;
                  setSelectedTurno(null);
                  handleAssign(id, seats);
                },
              }
            : null
        }
      />
    </div>
  );
};

export default ComponenteGestorTurnos;
