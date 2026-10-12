import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const PaginaEdicionRuta = () => {
  const { idRuta } = useParams();
  const [ruta, setRuta] = useState({
    PuntoSalida: "",
    PuntoLlegada: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!idRuta) return;

    fetch(`http://localhost:3001/api/ruta/${idRuta}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.IDRuta) {
          setRuta(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener la ruta:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos de la ruta."
        });
        setLoading(false);
      });
  }, [idRuta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRuta((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:3001/api/ruta/${idRuta}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ruta),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la ruta");
      }

      Swal.fire({
        icon: "success",
        title: "¡Ruta Actualizada!",
        text: "Los cambios fueron guardados exitosamente.",
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/ComponenteGestorRuta");
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar la ruta:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudo actualizar la ruta: ${error.message}`
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
            onClick={() => navigate("/ComponenteGestorRuta")}
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Volver a Rutas
          </button>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="airova-card p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: "48px", height: "48px", background: "rgba(8, 145, 178, 0.1)", color: "#0891b2", fontSize: "1.3rem" }}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </div>
                <div>
                  <h2 className="h4 fw-bold text-dark mb-0">Editar Ruta #{idRuta}</h2>
                  <p className="text-muted small mb-0">Modifica los terminales de salida y llegada</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="text-muted mt-2">Cargando datos de la ruta...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold text-secondary small">
                        Punto de Salida (Origen) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white text-muted">
                          <i className="fa-solid fa-location-dot text-success"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="PuntoSalida"
                          value={ruta.PuntoSalida || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold text-secondary small">
                        Punto de Llegada (Destino) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white text-muted">
                          <i className="fa-solid fa-flag-checkered text-danger"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="PuntoLlegada"
                          value={ruta.PuntoLlegada || ""}
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
                      onClick={() => navigate("/ComponenteGestorRuta")}
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
                          <i className="fa-solid fa-check"></i> Actualizar Ruta
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

export default PaginaEdicionRuta;
