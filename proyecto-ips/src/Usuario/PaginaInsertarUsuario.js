import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const PaginaInsertarUsuario = () => {
  const [usuario, setUsuario] = useState({
    Nombre: "",
    Nombre_Usuario: "",
    Contrasena: "",
    DNI: "",
    Codigo_Cargo: "",
    Edad: "",
    Sexo: 1,
    Celular: "",
    Email: "",
    Direccion: "",
    EstadoRegistro: "Activo",
    img: null,
  });
  const [cargos, setCargos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/cargos`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setCargos(data))
      .catch((error) => console.error("Error al obtener los cargos:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setUsuario((prevState) => ({
      ...prevState,
      img: e.target.files[0],
    }));
  };

  const handleCargoChange = (e) => {
    setUsuario((prevState) => ({
      ...prevState,
      Codigo_Cargo: e.target.value,
    }));
  };

  const handleSexoChange = (e) => {
    const sexoValue = e.target.value === "Masculino" ? 1 : 0;
    setUsuario((prevState) => ({
      ...prevState,
      Sexo: sexoValue,
    }));
  };

  const getMaxCodigoUsuario = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/maxCodigoUsuario`);
      if (!response.ok) {
        throw new Error("Error al obtener el código de usuario");
      }
      const data = await response.json();
      return data.maxCodigoUsuario || 0;
    } catch (error) {
      console.error("Error al obtener el código de usuario:", error);
      return 0;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !usuario.Nombre ||
      !usuario.Nombre_Usuario ||
      !usuario.Contrasena ||
      !usuario.DNI ||
      !usuario.Codigo_Cargo ||
      !usuario.Edad
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos Incompletos",
        text: "Por favor, completa los campos requeridos."
      });
      return;
    }

    const edad = parseInt(usuario.Edad, 10);
    if (isNaN(edad) || edad < 18 || edad > 60) {
      Swal.fire({
        icon: "warning",
        title: "Edad No Permitida",
        text: "La edad debe estar comprendida entre 18 y 60 años."
      });
      return;
    }

    if (usuario.DNI.length !== 8) {
      Swal.fire({
        icon: "warning",
        title: "DNI Inválido",
        text: "El DNI debe tener exactamente 8 dígitos."
      });
      return;
    }

    setSubmitting(true);
    try {
      const maxCodigoUsuario = await getMaxCodigoUsuario();
      const nuevoCodigoUsuario = (maxCodigoUsuario || 0) + 1;

      const formData = new FormData();
      formData.append("Codigo_Usuario", nuevoCodigoUsuario);
      for (const key in usuario) {
        if (usuario[key] !== null) {
          formData.append(key, usuario[key]);
        }
      }

      const response = await fetch(`http://localhost:3001/api/insert`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al insertar en la base de datos");
      }

      Swal.fire({
        icon: "success",
        title: "¡Usuario Registrado!",
        text: `${usuario.Nombre} fue agregado correctamente.`,
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/GestionarUsuarios");
      }, 1500);
    } catch (error) {
      console.error("Error al insertar usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudo registrar el usuario: ${error.message}`
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
                  style={{ width: "48px", height: "48px", background: "rgba(5, 150, 105, 0.1)", color: "#059669", fontSize: "1.3rem" }}
                >
                  <i className="fa-solid fa-user-plus"></i>
                </div>
                <div>
                  <h2 className="h4 fw-bold text-dark mb-0">Registrar Nuevo Usuario</h2>
                  <p className="text-muted small mb-0">Completa la información laboral y credenciales de acceso</p>
                </div>
              </div>

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
                      placeholder="Ej. Juan Pérez Ramos"
                      value={usuario.Nombre}
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
                      placeholder="Ej. jperez"
                      value={usuario.Nombre_Usuario}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Contraseña <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="Contrasena"
                      placeholder="Contraseña segura"
                      value={usuario.Contrasena}
                      onChange={handleChange}
                      required
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
                      placeholder="8 dígitos"
                      maxLength="8"
                      value={usuario.DNI}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Cargo / Rol <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="Codigo_Cargo"
                      value={usuario.Codigo_Cargo}
                      onChange={handleCargoChange}
                      required
                    >
                      <option value="">Seleccione un cargo...</option>
                      {cargos.map((cargo) => (
                        <option key={cargo.Codigo_Cargo} value={cargo.Codigo_Cargo}>
                          {cargo.Descripcion}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold text-secondary small">
                      Edad (18-60) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="Edad"
                      min="18"
                      max="60"
                      value={usuario.Edad}
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
                      value={usuario.Sexo === 1 ? "Masculino" : "Femenino"}
                      onChange={handleSexoChange}
                      required
                    >
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Celular <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="Celular"
                      placeholder="9 dígitos"
                      maxLength="9"
                      value={usuario.Celular}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Correo Electrónico <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="Email"
                      placeholder="correo@ejemplo.com"
                      value={usuario.Email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary small">
                      Dirección <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="Direccion"
                      placeholder="Dirección de residencia"
                      value={usuario.Direccion}
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
                      value={usuario.EstadoRegistro}
                      onChange={handleChange}
                      required
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Foto de Perfil
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
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
                        <i className="fa-solid fa-floppy-disk"></i> Guardar Usuario
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

export default PaginaInsertarUsuario;
