import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ComponenteGestorUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/data");
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
    }
  };

  const handleDelete = async (codigoUsuario) => {
    console.log("Código de usuario a eliminar:", codigoUsuario);
    if (window.confirm("¿Estás seguro que deseas eliminar este usuario?")) {
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
        fetchData();
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  const handleEdit = (codigoUsuario) => {
    navigate(`/editar/${codigoUsuario}`);
  };

  const renderSexo = (sexo) => {
    return sexo ? "Masculino" : "Femenino";
  };

  return (
    <div>
      <button onClick={() => navigate("/InsertarUsuario")}>
        Insertar Usuario
      </button>
      <h2>Lista de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Código de Usuario</th>
            <th>Nombre</th>
            <th>Nombre de Usuario</th>
            <th>DNI</th>
            <th>Código de Cargo</th>
            <th>Edad</th>
            <th>Sexo</th>
            <th>Celular</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.Codigo_Usuario}>
              <td>{usuario.Codigo_Usuario}</td>
              <td>{usuario.Nombre}</td>
              <td>{usuario.Nombre_Usuario}</td>
              <td>{usuario.DNI}</td>
              <td>{usuario.Codigo_Cargo}</td>
              <td>{usuario.Edad}</td>
              <td>{renderSexo(usuario.Sexo)}</td>
              <td>{usuario.Celular}</td>
              <td>{usuario.Email}</td>
              <td>{usuario.Direccion}</td>
              <td>
                <button onClick={() => handleDelete(usuario.Codigo_Usuario)}>
                  Eliminar
                </button>
                <button onClick={() => handleEdit(usuario.Codigo_Usuario)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComponenteGestorUsuarios;