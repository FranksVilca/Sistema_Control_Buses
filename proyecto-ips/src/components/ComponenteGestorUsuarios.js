import React, { useState, useEffect } from "react";

const ComponenteGestorUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/data"); // Ajusta la URL según corresponda
        if (!response.ok) {
          throw new Error("La respuesta de la API no fue exitosa");
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
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
              <td>{usuario.Sexo}</td>
              <td>{usuario.Celular}</td>
              <td>{usuario.Email}</td>
              <td>{usuario.Direccion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComponenteGestorUsuarios;
