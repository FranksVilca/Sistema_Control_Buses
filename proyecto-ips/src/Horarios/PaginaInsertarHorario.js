import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const PaginaInsertarHorario = () => {
  const [horario, setHorario] = useState({
    Fecha: "",
    Hora_Salida: "",
    Hora_Llegada: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHorario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];

    if (horario.Fecha < today) {
      Swal.fire({
        icon: "warning",
        title: "Fecha Inválida",
        text: "La fecha programada no puede ser anterior al día de hoy."
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:3001/api/insert/horario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(horario),
      });

      if (!response.ok) {
        throw new Error("Error al insertar el horario");
      }

      Swal.fire({
        icon: "success",
        title: "¡Horario Registrado!",
        text: "El nuevo itinerario se guardó correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/ComponenteGestorHorarios");
      }, 1500);
    } catch (error) {
      console.error("Error al insertar el horario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudo registrar el horario: ${error.message}`
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
            onClick={() => navigate("/ComponenteGestorHorarios")}
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Volver a Horarios
          </button>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="airova-card p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: "48px", height: "48px", background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed", fontSize: "1.3rem" }}
                >
                  <i className="fa-solid fa-calendar-plus"></i>
                </div>
                <div>
                  <h2 className="h4 fw-bold text-dark mb-0">Programar Nuevo Horario</h2>
                  <p className="text-muted small mb-0">Establece la fecha y las horas de salida y llegada para los viajes</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary small">
                      Fecha de Salida <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted">
                        <i className="fa-solid fa-calendar-day text-primary"></i>
                      </span>
                      <input
                        type="date"
                        className="form-control"
                        name="Fecha"
                        value={horario.Fecha}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Hora de Salida <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted">
                        <i className="fa-solid fa-clock text-success"></i>
                      </span>
                      <input
                        type="time"
                        className="form-control"
                        name="Hora_Salida"
                        value={horario.Hora_Salida}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Hora Estimada de Llegada <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted">
                        <i className="fa-solid fa-clock text-danger"></i>
                      </span>
                      <input
                        type="time"
                        className="form-control"
                        name="Hora_Llegada"
                        value={horario.Hora_Llegada}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate("/ComponenteGestorHorarios")}
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
                        <i className="fa-solid fa-floppy-disk"></i> Guardar Horario
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

export default PaginaInsertarHorario;
