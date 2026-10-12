import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const ComponenteGestorUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/data");
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la lista de usuarios. Verifica la conexión con el backend."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (codigoUsuario, nombre) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `¿Estás seguro de eliminar al usuario ${nombre || `#${codigoUsuario}`}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/delete/${codigoUsuario}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Error al eliminar el usuario");
        }
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El usuario ha sido eliminado exitosamente.",
          timer: 1500,
          showConfirmButton: false
        });
        fetchData();
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el usuario."
        });
      }
    }
  };

  const handleEdit = (codigoUsuario) => {
    navigate(`/editar/${codigoUsuario}`);
  };

  const getCargoBadge = (codigoCargo) => {
    switch (codigoCargo) {
      case 1:
        return <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1"><i className="fa-solid fa-crown me-1"></i> Admin</span>;
      case 2:
        return <span className="badge bg-info bg-opacity-10 text-info px-2 py-1"><i className="fa-solid fa-user me-1"></i> Trabajador</span>;
      case 3:
        return <span className="badge bg-warning bg-opacity-10 text-warning px-2 py-1"><i className="fa-solid fa-id-badge me-1"></i> Chofer</span>;
      default:
        return <span className="badge bg-secondary bg-opacity-10 text-secondary px-2 py-1">Cargo {codigoCargo}</span>;
    }
  };

  const filteredUsuarios = usuarios.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.Nombre && u.Nombre.toLowerCase().includes(term)) ||
      (u.Nombre_Usuario && u.Nombre_Usuario.toLowerCase().includes(term)) ||
      (u.DNI && u.DNI.includes(term)) ||
      (u.Email && u.Email.toLowerCase().includes(term)) ||
      (u.Codigo_Usuario && u.Codigo_Usuario.toString().includes(term))
    );
  });

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />

      <div className="container py-4 px-3 px-md-4">
        {/* Header bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded">
                <i className="fa-solid fa-users me-1"></i> Equipo y Personal
              </span>
              <span className="text-muted small">• Total: {usuarios.length} usuarios</span>
            </div>
            <h1 className="h3 fw-bold text-dark mb-0">Gestión de Usuarios</h1>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-airova-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/InsertarUsuario")}
            >
              <i className="fa-solid fa-user-plus"></i>
              <span>Registrar Usuario</span>
            </button>
          </div>
        </div>

        {/* Filter Card */}
        <div className="airova-card p-3 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Buscar por nombre, usuario, DNI o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary border-start-0 border-end-0"
                    type="button"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-12 col-md-6 text-md-end text-muted small">
              Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="airova-card overflow-hidden">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2 mb-0">Cargando personal y usuarios...</p>
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 text-muted mb-2">
                <i className="fa-solid fa-users-slash opacity-50"></i>
              </div>
              <h5 className="fw-semibold text-secondary">No se encontraron usuarios</h5>
              <p className="text-muted small">
                {searchTerm ? "Prueba con otro término de búsqueda." : "Aún no hay usuarios registrados."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="ps-4 text-secondary text-uppercase fs-7 fw-semibold">ID</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Nombre y Usuario</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">DNI</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Cargo</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Contacto</th>
                    <th className="pe-4 text-secondary text-uppercase fs-7 fw-semibold text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((u) => (
                    <tr key={u.Codigo_Usuario}>
                      <td className="ps-4 fw-bold text-secondary">#{u.Codigo_Usuario}</td>
                      <td>
                        <div className="fw-semibold text-dark">{u.Nombre}</div>
                        <div className="text-muted small">@{u.Nombre_Usuario}</div>
                      </td>
                      <td>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary font-monospace">
                          {u.DNI || "Sin DNI"}
                        </span>
                      </td>
                      <td>{getCargoBadge(u.Codigo_Cargo)}</td>
                      <td>
                        <div className="small text-dark">
                          {u.Email && (
                            <div><i className="fa-solid fa-envelope me-1 text-muted"></i>{u.Email}</div>
                          )}
                          {u.Celular && (
                            <div><i className="fa-solid fa-phone me-1 text-muted"></i>{u.Celular}</div>
                          )}
                        </div>
                      </td>
                      <td className="pe-4 text-end">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(u.Codigo_Usuario)}
                            title="Editar usuario"
                          >
                            <i className="fa-solid fa-pen-to-square me-1"></i> Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(u.Codigo_Usuario, u.Nombre)}
                            title="Eliminar usuario"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponenteGestorUsuarios;
