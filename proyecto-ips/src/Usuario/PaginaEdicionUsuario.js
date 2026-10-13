import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import IdBadge, { formatId } from "../components/IdBadge";
import Swal from "sweetalert2";

const PaginaEdicionUsuario = () => {
  const params = useParams();
  const location = useLocation();
  const codigoUsuario =
    params.codigoUsuario ||
    location.state?.codigoUsuario ||
    sessionStorage.getItem("airova_edit_user_id");
  const [usuario, setUsuario] = useState({
    Nombre: "",
    Nombre_Usuario: "",
    Contrasena: "",
    DNI: "",
    Codigo_Cargo: "",
    Edad: "",
    Sexo: "",
    Celular: "",
    Email: "",
    Direccion: "",
    EstadoRegistro: "Activa",
  });
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!codigoUsuario) {
      navigate("/GestionarUsuarios");
      return;
    }
    const fetchData = async () => {
      try {
        const [usuarioResponse, cargosResponse] = await Promise.all([
          fetch(`http://localhost:3001/api/data/${codigoUsuario}`),
          fetch(`http://localhost:3001/api/cargos`)
        ]);

        if (!usuarioResponse.ok) {
          throw new Error(`Error HTTP: ${usuarioResponse.status}`);
        }

        if (!cargosResponse.ok) {
          throw new Error(`Error HTTP: ${cargosResponse.status}`);
        }

        const usuarioData = await usuarioResponse.json();
        const cargosData = await cargosResponse.json();

        setUsuario((prev) => ({
          ...prev,
          ...usuarioData,
          Sexo: usuarioData.Sexo ?? 2,
        }));
        setCargos(cargosData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos del usuario."
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [codigoUsuario, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCargoChange = (e) => {
    setUsuario((prevState) => ({
      ...prevState,
      Codigo_Cargo: e.target.value,
    }));
  };

  const handleSexoChange = (e) => {
    const sexoValue = parseInt(e.target.value, 10);
    setUsuario((prevState) => ({
      ...prevState,
      Sexo: sexoValue,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/[^0-9]/g, '');
    setUsuario((prevState) => ({
      ...prevState,
      [name]: filteredValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usuario.DNI && usuario.DNI.length !== 8) {
      Swal.fire({
        icon: "warning",
        title: "DNI Inválido",
        text: "El DNI debe tener exactamente 8 dígitos."
      });
      return;
    }

    if (usuario.Edad && usuario.Edad < 18) {
      Swal.fire({
        icon: "warning",
        title: "Edad Inválida",
        text: "La edad debe ser mayor o igual a 18 años."
      });
      return;
    }

    if (usuario.Celular && usuario.Celular.length !== 9) {
      Swal.fire({
        icon: "warning",
        title: "Celular Inválido",
        text: "El celular debe tener 9 dígitos."
      });
      return;
    }

    setSubmitting(true);
    const { img, ...usuarioSinImg } = usuario;

    try {
      const response = await fetch(
        `http://localhost:3001/api/update/${codigoUsuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuarioSinImg),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al actualizar");
      }

      Swal.fire({
        icon: "success",
        title: "¡Usuario Actualizado!",
        text: `El usuario ${formatId(codigoUsuario, "USR")} fue actualizado con éxito.`,
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/GestionarUsuarios");
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error al actualizar: ${error.message}`
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
            onClick={() => navigate("/GestionarUsuarios")}
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Volver a Usuarios
          </button>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="airova-card p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: "48px", height: "48px", background: "rgba(64, 222, 65, 0.12)", color: "#40DE41", fontSize: "1.3rem" }}
                >
                  <i className="fa-solid fa-user-pen"></i>
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <h2 className="h4 fw-bold text-dark mb-0">Editar Usuario</h2>
                    <IdBadge prefix="USR" id={codigoUsuario} />
                  </div>
                  <p className="text-muted small mb-0">Modifica los datos personales, cargo o credenciales</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="text-muted mt-2">Cargando usuario...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Nombre Completo <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Nombre"
                        value={usuario.Nombre || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Nombre de Usuario (Login) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Nombre_Usuario"
                        value={usuario.Nombre_Usuario || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Nueva Contraseña (Opcional)
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="Contrasena"
                        placeholder="Dejar en blanco para mantener actual"
                        value={usuario.Contrasena || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        DNI <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="DNI"
                        maxLength="8"
                        value={usuario.DNI || ""}
                        onInput={handleNumberChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Cargo Asignado <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="Codigo_Cargo"
                        value={usuario.Codigo_Cargo || ""}
                        onChange={handleCargoChange}
                        required
                      >
                        <option value="">Seleccione un cargo</option>
                        {cargos.map((cargo) => (
                          <option key={cargo.Codigo_Cargo} value={cargo.Codigo_Cargo}>
                            {cargo.Descripcion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 col-md-3">
                      <label className="form-label fw-semibold text-secondary small">
                        Edad <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="Edad"
                        min="18"
                        value={usuario.Edad || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-3">
                      <label className="form-label fw-semibold text-secondary small">
                        Sexo <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="Sexo"
                        value={usuario.Sexo !== null ? usuario.Sexo.toString() : "2"}
                        onChange={handleSexoChange}
                        required
                      >
                        <option value="2">Seleccionar</option>
                        <option value="1">Masculino</option>
                        <option value="0">Femenino</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Celular
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Celular"
                        maxLength="9"
                        value={usuario.Celular || ""}
                        onInput={handleNumberChange}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="Email"
                        value={usuario.Email || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold text-secondary small">
                        Dirección
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Direccion"
                        value={usuario.Direccion || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={() => navigate("/GestionarUsuarios")}
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
                          <i className="fa-solid fa-check"></i> Actualizar Usuario
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

export default PaginaEdicionUsuario;
