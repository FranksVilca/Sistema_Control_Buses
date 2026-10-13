import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import IdBadge, { formatId } from "../components/IdBadge";
import DetailModal from "../components/DetailModal";
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 10;

const Asistencia = () => {
    const [turnos, setTurnos] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAsistencia, setFilterAsistencia] = useState("todos");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAsistencia, setSelectedAsistencia] = useState(null);
    const params = useParams();
    const location = useLocation();
    const codigoTurno = params.codigoTurno || location.state?.codigoTurno || 1;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAsistencias = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/Asistencias/${codigoTurno}`);
                const agrupadoPorTurno = agruparPorTurno(response.data);
                setTurnos(agrupadoPorTurno);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching asistencias:', err);
                setError(err);
                setLoading(false);
            }
        };

        if (codigoTurno) {
            fetchAsistencias();
        }
    }, [codigoTurno]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterAsistencia]);

    const agruparPorTurno = (asistencias) => {
        return asistencias.reduce((acc, asistencia) => {
            const { Codigo_Turno } = asistencia;
            if (!acc[Codigo_Turno]) {
                acc[Codigo_Turno] = [];
            }
            acc[Codigo_Turno].push(asistencia);
            return acc;
        }, {});
    };

    const handleAsistenciaChange = async (codigoAsistencia, newValue, nombreUsuario) => {
        try {
            const intValue = newValue ? 1 : 0;
            await axios.put(`http://localhost:3001/api/Asistencia/${codigoAsistencia}`, { Asistencia: intValue });
            
            setTurnos((prevTurnos) =>
                Object.fromEntries(
                    Object.entries(prevTurnos).map(([turno, asistencias]) => [
                        turno,
                        asistencias.map((asistencia) =>
                            asistencia.Codigo_Asistencia === codigoAsistencia
                                ? { ...asistencia, Asistencia: intValue }
                                : asistencia
                        )
                    ])
                )
            );

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: intValue ? 'success' : 'info',
                title: `${nombreUsuario}: marcado como ${intValue ? 'Asistió' : 'Faltó'}`,
                showConfirmButton: false,
                timer: 2000
            });
        } catch (err) {
            console.error('Error updating asistencia:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el estado de asistencia.'
            });
        }
    };

    const hasActiveFilters = searchTerm !== "" || filterAsistencia !== "todos";

    const clearFilters = () => {
        setSearchTerm("");
        setFilterAsistencia("todos");
        setCurrentPage(1);
    };

    return (
        <div className="min-vh-100 bg-light d-flex flex-column">
            <Navbar />

            <div className="container py-4 px-3 px-md-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                    <button
                        className="btn btn-link text-decoration-none text-muted p-0"
                        onClick={() => navigate(-1)}
                    >
                        <i className="fa-solid fa-arrow-left me-1"></i> Regresar
                    </button>
                </div>

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
                                <i className="fa-solid fa-clipboard-check me-1"></i> Control de Personal
                            </span>
                            <IdBadge prefix="TRN" id={codigoTurno} />
                        </div>
                        <h1 className="h3 fw-bold text-dark mb-0">Registro de Asistencias</h1>
                    </div>
                </div>

                {/* Filter Card */}
                <div className="airova-card p-3 mb-4">
                    <div className="row g-3 align-items-end">
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-semibold text-secondary mb-1">
                                <i className="fa-solid fa-magnifying-glass me-1"></i> Buscar Pasajero / Personal
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 text-muted">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0"
                                    placeholder="Buscar por código (USR-001) o nombre..."
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

                        <div className="col-8 col-md-4">
                            <label className="form-label small fw-semibold text-secondary mb-1">
                                <i className="fa-solid fa-filter me-1"></i> Estado de Asistencia
                            </label>
                            <select
                                className="form-select"
                                value={filterAsistencia}
                                onChange={(e) => setFilterAsistencia(e.target.value)}
                            >
                                <option value="todos">Todos los estados</option>
                                <option value="asistio">Asistió</option>
                                <option value="falto">Faltó</option>
                            </select>
                        </div>

                        <div className="col-4 col-md-2 d-flex justify-content-md-end">
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-1"
                                    onClick={clearFilters}
                                >
                                    <i className="fa-solid fa-filter-circle-xmark"></i> Limpiar
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="airova-card p-5 text-center">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="text-muted mt-2 mb-0">Cargando lista de asistencia...</p>
                    </div>
                ) : error ? (
                    <div className="airova-card p-4 text-center">
                        <div className="fs-1 text-danger mb-2">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <h5 className="fw-semibold text-danger">Error al cargar asistencias</h5>
                        <p className="text-muted small mb-0">{error.message}</p>
                    </div>
                ) : Object.keys(turnos).length === 0 ? (
                    <div className="airova-card p-5 text-center">
                        <div className="fs-1 text-muted mb-2">
                            <i className="fa-solid fa-users-slash opacity-50"></i>
                        </div>
                        <h5 className="fw-semibold text-secondary">No hay pasajeros o personal registrado en este turno</h5>
                        <p className="text-muted small mb-0">Puedes asignar personal a este turno desde el módulo de turnos.</p>
                    </div>
                ) : (
                    Object.entries(turnos).map(([turno, asistencias]) => {
                        const filteredAsistencias = asistencias.filter((a) => {
                            const term = searchTerm.toLowerCase();
                            const formattedCode = formatId(a.Codigo_Usuario, "USR").toLowerCase();
                            const matchesSearch =
                                !term ||
                                (a.Nombre && a.Nombre.toLowerCase().includes(term)) ||
                                (a.Codigo_Usuario && a.Codigo_Usuario.toString().includes(term)) ||
                                formattedCode.includes(term);

                            const matchesEstado =
                                filterAsistencia === "todos" ||
                                (filterAsistencia === "asistio" && Boolean(a.Asistencia)) ||
                                (filterAsistencia === "falto" && !a.Asistencia);

                            return matchesSearch && matchesEstado;
                        });

                        const totalPages = Math.max(1, Math.ceil(filteredAsistencias.length / ITEMS_PER_PAGE));
                        const safePage = Math.min(currentPage, totalPages);
                        const paginatedAsistencias = filteredAsistencias.slice(
                            (safePage - 1) * ITEMS_PER_PAGE,
                            safePage * ITEMS_PER_PAGE
                        );

                        return (
                            <div className="airova-card overflow-hidden mb-4" key={turno}>
                                <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
                                    <div className="d-flex align-items-center gap-2">
                                        <IdBadge prefix="TRN" id={turno} />
                                        <span className="text-muted small">
                                            Mostrando {filteredAsistencias.length} de {asistencias.length} asignados
                                        </span>
                                    </div>
                                </div>

                                {filteredAsistencias.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p className="text-muted mb-2">No se encontraron pasajeros con los filtros aplicados.</p>
                                        <button className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
                                            <i className="fa-solid fa-rotate-left me-1"></i> Restablecer Filtros
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th className="ps-4 text-secondary text-uppercase fs-7 fw-semibold">ID</th>
                                                        <th className="text-secondary text-uppercase fs-7 fw-semibold">Personal / Pasajero</th>
                                                        <th className="text-secondary text-uppercase fs-7 fw-semibold">Estado de Asistencia</th>
                                                        <th className="pe-4 text-secondary text-uppercase fs-7 fw-semibold text-end">Acción Rápida</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginatedAsistencias.map((asistencia) => (
                                                        <tr key={asistencia.Codigo_Asistencia}>
                                                            <td className="ps-4">
                                                                <IdBadge prefix="USR" id={asistencia.Codigo_Usuario} />
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <div
                                                                        className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary"
                                                                        style={{ width: "36px", height: "36px", fontSize: "0.85rem" }}
                                                                    >
                                                                        <i className="fa-solid fa-user"></i>
                                                                    </div>
                                                                    <span className="fw-semibold text-dark">{asistencia.Nombre}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {asistencia.Asistencia ? (
                                                                    <span className="badge-status badge-status-activo">
                                                                        <i className="fa-solid fa-circle-check"></i> Asistió
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge-status badge-status-inactivo">
                                                                        <i className="fa-solid fa-circle-xmark"></i> Faltó
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="pe-4 text-end">
                                                                <div className="d-inline-flex align-items-center gap-2">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-secondary"
                                                                        onClick={() => setSelectedAsistencia(asistencia)}
                                                                        title="Ver detalle de asistencia"
                                                                    >
                                                                        <i className="fa-solid fa-eye me-1"></i> Detalle
                                                                    </button>
                                                                    <select
                                                                        className="form-select form-select-sm d-inline-block w-auto"
                                                                        value={asistencia.Asistencia ? "1" : "0"}
                                                                        onChange={(e) =>
                                                                            handleAsistenciaChange(
                                                                                asistencia.Codigo_Asistencia,
                                                                                e.target.value === "1",
                                                                                asistencia.Nombre
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value="1">Marcar: Asistió</option>
                                                                        <option value="0">Marcar: Faltó</option>
                                                                    </select>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <Pagination
                                            currentPage={safePage}
                                            totalItems={filteredAsistencias.length}
                                            itemsPerPage={ITEMS_PER_PAGE}
                                            onPageChange={setCurrentPage}
                                            itemLabel="pasajeros"
                                        />
                                    </>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal de Vista Detalle */}
            <DetailModal
                isOpen={Boolean(selectedAsistencia)}
                onClose={() => setSelectedAsistencia(null)}
                title={selectedAsistencia?.Nombre || "Detalle de Asistencia"}
                subtitle="Registro de control de embarque y asistencia de personal"
                icon="fa-clipboard-check"
                idBadge={
                    selectedAsistencia
                        ? { prefix: "USR", id: selectedAsistencia.Codigo_Usuario }
                        : null
                }
                statusBadge={
                    selectedAsistencia ? (
                        selectedAsistencia.Asistencia ? (
                            <span className="badge-status badge-status-activo">
                                <i className="fa-solid fa-circle-check"></i> Asistió
                            </span>
                        ) : (
                            <span className="badge-status badge-status-inactivo">
                                <i className="fa-solid fa-circle-xmark"></i> Faltó
                            </span>
                        )
                    ) : null
                }
                fields={
                    selectedAsistencia
                        ? [
                              {
                                  label: "Código de Trabajador",
                                  value: formatId(selectedAsistencia.Codigo_Usuario, "USR"),
                                  icon: "fa-id-badge",
                              },
                              {
                                  label: "Turno Asignado",
                                  value: formatId(
                                      selectedAsistencia.Codigo_Turno || codigoTurno,
                                      "TRN"
                                  ),
                                  icon: "fa-calendar-days",
                              },
                              {
                                  label: "Nombre Completo",
                                  value: selectedAsistencia.Nombre,
                                  icon: "fa-user",
                              },
                              {
                                  label: "Estado de Embarque",
                                  value: selectedAsistencia.Asistencia
                                      ? "Asistencia Confirmada"
                                      : "Ausente / No Embarcó",
                                  icon: "fa-clipboard-user",
                              },
                          ]
                        : []
                }
                primaryAction={
                    selectedAsistencia
                        ? {
                              label: selectedAsistencia.Asistencia
                                  ? "Cambiar a Faltó"
                                  : "Confirmar Asistencia",
                              icon: selectedAsistencia.Asistencia
                                  ? "fa-circle-xmark"
                                  : "fa-circle-check",
                              onClick: () => {
                                  const nextState = !selectedAsistencia.Asistencia;
                                  handleAsistenciaChange(
                                      selectedAsistencia.Codigo_Asistencia,
                                      nextState,
                                      selectedAsistencia.Nombre
                                  );
                                  setSelectedAsistencia((prev) =>
                                      prev ? { ...prev, Asistencia: nextState ? 1 : 0 } : null
                                  );
                              },
                          }
                        : null
                }
            />
        </div>
    );
};

export default Asistencia;
