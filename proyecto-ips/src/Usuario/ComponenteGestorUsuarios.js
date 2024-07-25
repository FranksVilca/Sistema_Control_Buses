import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./ComponenteGestorUsuario.module.css";

const ComponenteGestorUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/VistaAdmin/${Codigo_Usuario}");
  };
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
    <div className={style.fondo}>
      <header className={style.header}>
        <div className={style.logoairova} onClick={handleLogoClick}>
        </div>
        <nav className={style.nav}>
          <ul className={style.ul}>
            <li className={style.li}>
              <a
                className={style.aopciones}
                onClick={() => navigate("/ComponenteGestorHorarios")}
              >
                Horario
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.aopciones}
                onClick={() => navigate("/ComponenteGestorBuses")}
              >
                Bus
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.aopciones}
                onClick={() => navigate("/ComponenteGestorRuta")}
              >
                Ruta
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.aopciones}
                onClick={() => navigate("/GestionarUsuarios")}
              >
                Usuarios
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.aopciones}
                onClick={() => navigate("/GestionarTurno")}
              >
                Turnos
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.acrear}
                onClick={() => navigate("/")}
              >
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <div className={style.gestorUsuarios}>
        <div className={style.gestorUsuariosBotonInsertar}>
          <button
            className={style.gestorUsuariosBoton}
            onClick={() => navigate("/InsertarUsuario")}
          >
            Insertar Usuario
          </button>
        </div>
        <h2 className={style.gestorUsuariosTitulo}>Lista de Usuarios</h2>
        <table className={style.gestorUsuariosTabla}>
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
    </div>
  );
};

export default ComponenteGestorUsuarios;
