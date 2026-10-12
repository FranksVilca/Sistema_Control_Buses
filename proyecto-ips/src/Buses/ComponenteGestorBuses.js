import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

const ComponenteGestorBuses = () => {
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/buses");
      if (!response.ok) {
        throw new Error("Error al obtener los buses");
      }
      const data = await response.json();
      setBuses(data);
    } catch (error) {
      console.error("Error al obtener la lista de buses:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la lista de buses. Verifica la conexión con el servidor."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idBus, placa) => {
    const result = await Swal.fire({
      title: "¿Eliminar este bus?",
      text: `¿Estás seguro de eliminar el bus con placa ${placa || idBus}? Esta acción no se puede deshacer.`,
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
          `http://localhost:3001/api/delete/bus/${idBus}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Error al eliminar el bus");
        }
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El bus ha sido eliminado exitosamente.",
          timer: 1500,
          showConfirmButton: false
        });
        fetchBuses();
      } catch (error) {
        console.error("Error al eliminar el bus:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el bus."
        });
      }
    }
  };

  const handleEdit = (idBus) => {
    navigate(`/PaginaEdicionBus/${idBus}`);
  };

  const filteredBuses = buses.filter((bus) => {
    const term = searchTerm.toLowerCase();
    return (
      (bus.Placa && bus.Placa.toLowerCase().includes(term)) ||
      (bus.Modelo && bus.Modelo.toLowerCase().includes(term)) ||
      (bus.Marca && bus.Marca.toLowerCase().includes(term)) ||
      (bus.IDBus && bus.IDBus.toString().includes(term)) ||
      (bus.EstadoRegistro && bus.EstadoRegistro.toLowerCase().includes(term))
    );
  });

  const getStatusBadge = (estado) => {
    const val = (estado || "").toLowerCase();
    if (val.includes("activo")) {
      return <span className="badge-status badge-status-activo"><i className="fa-solid fa-circle-check"></i> Activo</span>;
    }
    if (val.includes("mantenimiento")) {
      return <span className="badge-status badge-status-mantenimiento"><i className="fa-solid fa-wrench"></i> Mantenimiento</span>;
    }
    return <span className="badge-status badge-status-inactivo"><i className="fa-solid fa-circle-xmark"></i> Inactivo</span>;
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />

      <div className="container py-4 px-3 px-md-4">
        {/* Header bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
                <i className="fa-solid fa-bus me-1"></i> Flota Vehicular
              </span>
              <span className="text-muted small">• Total: {buses.length} buses</span>
            </div>
            <h1 className="h3 fw-bold text-dark mb-0">Gestión de Buses</h1>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-airova-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/InsertarBus")}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Registrar Bus</span>
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
                  placeholder="Buscar por placa, modelo, marca o ID..."
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
              Mostrando {filteredBuses.length} de {buses.length} unidades registradas
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="airova-card overflow-hidden">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted mt-2 mb-0">Cargando unidades vehiculares...</p>
            </div>
          ) : filteredBuses.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 text-muted mb-2">
                <i className="fa-solid fa-bus-simple opacity-50"></i>
              </div>
              <h5 className="fw-semibold text-secondary">No se encontraron buses</h5>
              <p className="text-muted small">
                {searchTerm ? "Prueba con otro término de búsqueda." : "Aún no hay buses registrados en el sistema."}
              </p>
              {!searchTerm && (
                <button
                  className="btn btn-airova-primary btn-sm mt-2"
                  onClick={() => navigate("/InsertarBus")}
                >
                  <i className="fa-solid fa-plus me-1"></i> Registrar Primer Bus
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="ps-4 text-secondary text-uppercase fs-7 fw-semibold">ID</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Placa</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Marca / Modelo</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold text-center">Asientos</th>
                    <th className="text-secondary text-uppercase fs-7 fw-semibold">Estado</th>
                    <th className="pe-4 text-secondary text-uppercase fs-7 fw-semibold text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuses.map((bus) => (
                    <tr key={bus.IDBus}>
                      <td className="ps-4 fw-bold text-secondary">#{bus.IDBus}</td>
                      <td>
                        <span className="badge bg-dark bg-opacity-10 text-dark px-2 py-1 font-monospace fw-bold fs-7">
                          {bus.Placa}
                        </span>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{bus.Modelo}</div>
                        <div className="text-muted small">{bus.Marca}</div>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-secondary bg-opacity-10 text-secondary px-2 py-1">
                          <i className="fa-solid fa-chair me-1"></i> {bus.Num_Asientos}
                        </span>
                      </td>
                      <td>{getStatusBadge(bus.EstadoRegistro)}</td>
                      <td className="pe-4 text-end">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(bus.IDBus)}
                            title="Editar bus"
                          >
                            <i className="fa-solid fa-pen-to-square me-1"></i> Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(bus.IDBus, bus.Placa)}
                            title="Eliminar bus"
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

export default ComponenteGestorBuses;
