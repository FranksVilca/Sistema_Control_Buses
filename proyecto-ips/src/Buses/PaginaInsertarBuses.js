import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const PaginaInsertarBus = () => {
  const [bus, setBus] = useState({
    Num_Asientos: "",
    EstadoRegistro: "Activo",
    Modelo: "",
    Marca: "",
    Placa: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:3001/api/insert/bus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bus),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      Swal.fire({
        icon: "success",
        title: "¡Bus Registrado!",
        text: `El bus con placa ${bus.Placa} fue insertado exitosamente.`,
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/ComponenteGestorBuses");
      }, 1500);
    } catch (error) {
      console.error("Error al insertar el bus:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudo registrar el bus: ${error.message}`,
        confirmButtonColor: "#40DE41",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />

      <div className="container py-4 px-3 px-md-4">
        {/* Breadcrumb & Navigation */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <button
            className="btn btn-link text-decoration-none text-muted p-0"
            onClick={() => navigate("/ComponenteGestorBuses")}
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Volver a Buses
          </button>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="airova-card p-4 p-md-5">
              {/* Form Title */}
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: "48px", height: "48px", background: "rgba(64, 222, 65, 0.12)", color: "#40DE41", fontSize: "1.3rem" }}
                >
                  <i className="fa-solid fa-bus-simple"></i>
                </div>
                <div>
                  <h2 className="h4 fw-bold text-dark mb-0">Registrar Nuevo Bus</h2>
                  <p className="text-muted small mb-0">Ingresa los datos técnicos y operativos de la unidad</p>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Placa <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted">
                        <i className="fa-solid fa-id-card"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="Placa"
                        placeholder="Ej. ABC-123"
                        value={bus.Placa}
                        onChange={handleChange}
                        pattern="[A-Za-z0-9]{3}-[0-9]{3}"
                        title="Formato sugerido AAA-123 (3 caracteres, guion, 3 dígitos)"
                        required
                      />
                    </div>
                    <div className="form-text">Formato estándar: AAA-123</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Estado de Registro <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="EstadoRegistro"
                      value={bus.EstadoRegistro}
                      onChange={handleChange}
                      required
                    >
                      <option value="Activo">Activo (Disponible)</option>
                      <option value="En Mantenimiento">En Mantenimiento</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Marca <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted">
                        <i className="fa-solid fa-tag"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="Marca"
                        placeholder="Ej. Mercedes-Benz, Scania, Volvo"
                        value={bus.Marca}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Modelo <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted">
                        <i className="fa-solid fa-car-side"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="Modelo"
                        placeholder="Ej. Paradiso G7, Tourismo"
                        value={bus.Modelo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Número de Asientos <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted">
                        <i className="fa-solid fa-chair"></i>
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        name="Num_Asientos"
                        placeholder="Capacidad total"
                        value={bus.Num_Asientos}
                        onChange={handleChange}
                        min="1"
                        max="80"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate("/ComponenteGestorBuses")}
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
                        <i className="fa-solid fa-floppy-disk"></i> Guardar Bus
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

export default PaginaInsertarBus;
