import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const AsignarTurno = () => {
  const { codigoTurno, numAsientos } = useParams();
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/usuarios?cargo=2");
      if (!response.ok) {
        throw new Error("Error al obtener los trabajadores");
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la lista de trabajadores."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (codigoUsuario) => {
    if (selectedUsuarios.includes(codigoUsuario)) {
      setSelectedUsuarios(selectedUsuarios.filter((id) => id !== codigoUsuario));
    } else if (selectedUsuarios.length < parseInt(numAsientos, 10)) {
      setSelectedUsuarios([...selectedUsuarios, codigoUsuario]);
    } else {
      Swal.fire({
        icon: "info",
        title: "Capacidad Máxima",
        text: `El bus ya tiene los ${numAsientos} asientos ocupados.`,
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleGuardarAsistencia = async () => {
    if (selectedUsuarios.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin selección",
        text: "Selecciona al menos un trabajador para asignar al turno."
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:3001/api/asistencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Codigo_Turno: codigoTurno,
          Trabajadores: selectedUsuarios,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la asignación");
      }

      Swal.fire({
        icon: "success",
        title: "¡Asignación Guardada!",
        text: `Se asignaron ${selectedUsuarios.length} pasajeros al turno #${codigoTurno}.`,
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/GestionarTurno");
      }, 1500);
    } catch (error) {
      console.error("Error al guardar asistencia:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la asignación."
      });
    } finally {
      setSubmitting(false);
    }
  };

  const seatsLeft = parseInt(numAsientos, 10) - selectedUsuarios.length;

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

        {/* Header bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
                <i className="fa-solid fa-users me-1"></i> Turno #{codigoTurno}
              </span>
              <span className="text-muted small">• Capacidad del Bus: {numAsientos} asientos</span>
            </div>
            <h1 className="h3 fw-bold text-dark mb-0">Asignar Pasajeros al Turno</h1>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="text-end">
              <span className="fw-bold fs-5 text-dark">{selectedUsuarios.length} / {numAsientos}</span>
              <div className="text-muted small">Asientos ocupados ({seatsLeft} disponibles)</div>
            </div>
            <button
              className="btn btn-airova-primary d-flex align-items-center gap-2 px-4"
              onClick={handleGuardarAsistencia}
              disabled={submitting || selectedUsuarios.length === 0}
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Guardando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk"></i> Guardar Asignación
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar of capacity */}
        <div className="airova-card p-3 mb-4">
          <div className="progress" style={{ height: "12px" }}>
            <div
              className={`progress-bar ${selectedUsuarios.length >= parseInt(numAsientos, 10) ? "bg-warning" : "bg-primary"}`}
              role="progressbar"
              style={{ width: `${(selectedUsuarios.length / parseInt(numAsientos, 10)) * 100}%` }}
              aria-valuenow={selectedUsuarios.length}
              aria-valuemin="0"
              aria-valuemax={numAsientos}
            ></div>
          </div>
        </div>

        {/* Table of selectable workers */}
        <div className="airova-card overflow-hidden">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2 mb-0">Cargando personal disponible...</p>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 text-muted mb-2">
                <i className="fa-solid fa-user-xmark opacity-50"></i>
              </div>
              <h5 className="fw-semibold text-secondary">No hay trabajadores disponibles</h5>
              <p className="text-muted small">Todos los trabajadores están asignados o no hay registrados con cargo Trabajador.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="ps-4" style={{ width: "60px" }}>Seleccionar</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">ID</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Nombre y Usuario</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">DNI</th>
                    <th className="pe-4 text-secondary text-uppercase fs-7 fw-semibold">Contacto</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => {
                    const isSelected = selectedUsuarios.includes(u.Codigo_Usuario);
                    return (
                      <tr
                        key={u.Codigo_Usuario}
                        onClick={() => handleCheckboxChange(u.Codigo_Usuario)}
                        style={{ cursor: "pointer" }}
                        className={isSelected ? "table-primary bg-opacity-25" : ""}
                      >
                        <td className="ps-4">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => {}} // Manejado por onClick del tr
                          />
                        </td>
                        <td className="fw-bold text-secondary">#{u.Codigo_Usuario}</td>
                        <td>
                          <div className="fw-semibold text-dark">{u.Nombre}</div>
                          <div className="text-muted small">@{u.Nombre_Usuario}</div>
                        </td>
                        <td>
                          <span className="badge bg-secondary bg-opacity-10 text-secondary font-monospace">
                            {u.DNI || "Sin DNI"}
                          </span>
                        </td>
                        <td className="pe-4 text-muted small">
                          {u.Celular ? (
                            <div><i className="fa-solid fa-phone me-1"></i>{u.Celular}</div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AsignarTurno;
