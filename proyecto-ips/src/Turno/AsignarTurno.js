import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "./AsignarTurno.module.css";

const AsignarTurno = () => {
  const handleLogoClick = () => {
    navigate("/VistaAdmin/${Codigo_Usuario}");
  };
  const { codigoTurno, numAsientos } = useParams();
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/usuarios?cargo=2"
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
    }
  };

  const handleCheckboxChange = (codigoUsuario) => {
    if (selectedUsuarios.includes(codigoUsuario)) {
      setSelectedUsuarios(
        selectedUsuarios.filter((id) => id !== codigoUsuario)
      );
    } else if (selectedUsuarios.length < numAsientos) {
      setSelectedUsuarios([...selectedUsuarios, codigoUsuario]);
    }
  };

  const handleGuardarAsistencia = async () => {
    if (selectedUsuarios.length > 0) {
      try {
        const response = await fetch("http://localhost:3001/api/asistencia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Codigo_Turno: codigoTurno,
            Trabajadores: selectedUsuarios,
          }),
        });
        if (!response.ok) {
          throw new Error("Error al guardar la asistencia");
        }
        alert("Asistencia guardada exitosamente");
        navigate("/GestionarTurno");
      } catch (error) {
        console.error("Error al guardar la asistencia:", error);
      }
    } else {
      alert("Debes seleccionar al menos un trabajador");
    }
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

      <div className={style.asignarTurno}>
        <h2 className={style.asignarTurnoTitulo}>Asignar Turno</h2>
        <div className={style.infoTurno}>
          <p>
            <strong>Código de Turno:</strong> {codigoTurno}
          </p>
          <p>
            <strong>Número de Asientos:</strong> {numAsientos}
          </p>
        </div>
        <table className={style.asignarTurnoTabla}>
          <thead>
            <tr>
              <th>Código de Usuario</th>
              <th>Nombre</th>
              <th>Nombre de Usuario</th>
              <th>DNI</th>
              <th>Celular</th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.Codigo_Usuario}>
                <td>{usuario.Codigo_Usuario}</td>
                <td>{usuario.Nombre}</td>
                <td>{usuario.Nombre_Usuario}</td>
                <td>{usuario.DNI}</td>
                <td>{usuario.Celular}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsuarios.includes(usuario.Codigo_Usuario)}
                    onChange={() =>
                      handleCheckboxChange(usuario.Codigo_Usuario)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleGuardarAsistencia}
          className={style.botonGuardar}
        >
          Guardar Asistencia
        </button>
      </div>
    </div>
  );
};

export default AsignarTurno;
