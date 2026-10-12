import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const PaginaInsertarRuta = () => {
  const [ruta, setRuta] = useState({
    PuntoSalida: "",
    PuntoLlegada: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRuta((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getMaxCodigoRuta = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/rutas/max`);
      if (!response.ok) {
        throw new Error("Error al obtener el código de ruta");
      }
      const data = await response.json();
      return data.maxCodigoRuta || 0;
    } catch (error) {
      console.error("Error al obtener el código de ruta:", error);
      return 0;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ruta.PuntoSalida || !ruta.PuntoLlegada) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa el punto de salida y llegada."
      });
      return;
    }

    setSubmitting(true);
    try {
      const maxCodigoRuta = await getMaxCodigoRuta();
      const nuevoCodigoRuta = (maxCodigoRuta || 0) + 1;
      const rutaConCodigo = {
        ...ruta,
        IDRuta: nuevoCodigoRuta,
      };

      const response = await fetch(`http://localhost:3001/api/ruta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rutaConCodigo),
      });

      if (!response.ok) {
        throw new Error("Error al insertar la ruta");
      }

      Swal.fire({
        icon: "success",
        title: "¡Ruta Creada!",
        text: `Trayecto ${ruta.PuntoSalida} - ${ruta.PuntoLlegada} registrado con éxito.`,
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/ComponenteGestorRuta");
      }, 1500);
    } catch (error) {
      console.error("Error al insertar la ruta:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudo registrar la ruta: ${error.message}`
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
                  <i className="fa-solid fa-map-location-dot"></i>
                </div>
                <div>
                  <h2 className="h4 fw-bold text-dark mb-0">Registrar Nueva Ruta</h2>
                  <p className="text-muted small mb-0">Define los terminales de origen y destino del trayecto</p>
                </div>
              </div>

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
                        placeholder="Ej. Terminal Terrestre Cusco, Paradero Santiago..."
                        value={ruta.PuntoSalida}
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
                        placeholder="Ej. Terminal Arequipa, Paradero Wanchaq..."
                        value={ruta.PuntoLlegada}
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
                        <i className="fa-solid fa-floppy-disk"></i> Guardar Ruta
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

export default PaginaInsertarRuta;
