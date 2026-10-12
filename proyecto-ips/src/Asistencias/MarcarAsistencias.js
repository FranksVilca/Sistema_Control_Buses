import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Swal from 'sweetalert2';

const Asistencia = () => {
    const [turnos, setTurnos] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { codigoTurno } = useParams(); 
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
                            <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded">
                                <i className="fa-solid fa-clipboard-check me-1"></i> Control de Personal
                            </span>
                            <span className="text-muted small">• Turno #{codigoTurno}</span>
                        </div>
                        <h1 className="h3 fw-bold text-dark mb-0">Registro de Asistencias</h1>
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
                    Object.entries(turnos).map(([turno, asistencias]) => (
                        <div className="airova-card p-4 mb-4" key={turno}>
                            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="badge bg-primary px-3 py-2 rounded-pill fs-7">
                                        <i className="fa-solid fa-calendar-day me-1"></i> Turno #{turno}
                                    </span>
                                    <span className="text-muted small">Total asignados: {asistencias.length}</span>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-3 text-secondary text-uppercase fs-7 fw-semibold">ID</th>
                                            <th className="text-secondary text-uppercase fs-7 fw-semibold">Personal / Pasajero</th>
                                            <th className="text-secondary text-uppercase fs-7 fw-semibold">Estado de Asistencia</th>
                                            <th className="pe-3 text-secondary text-uppercase fs-7 fw-semibold text-end">Acción Rápida</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {asistencias.map((asistencia) => (
                                            <tr key={asistencia.Codigo_Asistencia}>
                                                <td className="ps-3 fw-bold text-secondary">#{asistencia.Codigo_Usuario}</td>
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
                                                <td className="pe-3 text-end">
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
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Asistencia;
