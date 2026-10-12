import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const PaginaEdicionBus = () => {
  const { idBus } = useParams();
  const [bus, setBus] = useState({
    Num_Asientos: "",
    EstadoRegistro: "Activo",
    Modelo: "",
    Marca: "",
    Placa: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/bus/${idBus}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setBus(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener el bus:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos del bus."
        });
        setLoading(false);
      });
  }, [idBus]);

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
      const response = await fetch(
        `http://localhost:3001/api/update/bus/${idBus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bus),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar");
      }

      Swal.fire({
        icon: "success",
        title: "¡Actualización Exitosa!",
        text: `El bus #${idBus} ha sido modificado.`,
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/ComponenteGestorBuses");
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar el bus:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar actualizar los datos."
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
            onClick={() => navigate("/ComponenteGestorBuses")}
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Volver a Buses
          </button>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="airova-card p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: "48px", height: "48px", background: "rgba(37, 99, 235, 0.1)", color: "#2563eb", fontSize: "1.3rem" }}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </div>
                <div>
                  <h2 className="h4 fw-bold text-dark mb-0">Editar Bus #{idBus}</h2>
                  <p className="text-muted small mb-0">Modifica los detalles técnicos o el estado de la unidad</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="text-muted mt-2">Cargando información del bus...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Placa <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Placa"
                        value={bus.Placa || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Estado de Registro <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="EstadoRegistro"
                        value={bus.EstadoRegistro || "Activo"}
                        onChange={handleChange}
                        required
                      >
                        <option value="Activo">Activo</option>
                        <option value="En Mantenimiento">En Mantenimiento</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Marca <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Marca"
                        value={bus.Marca || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Modelo <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Modelo"
                        value={bus.Modelo || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Número de Asientos <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="Num_Asientos"
                        value={bus.Num_Asientos || ""}
                        onChange={handleChange}
                        min="1"
                        max="80"
                        required
                      />
                    </div>
                  </div>

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
                          <i className="fa-solid fa-check"></i> Actualizar Cambios
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaEdicionBus;
