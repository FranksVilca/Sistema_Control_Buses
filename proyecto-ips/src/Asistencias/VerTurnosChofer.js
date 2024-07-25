import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./ComponenteGestorTurnos.module.css"; // Ajusta el nombre del archivo CSS según corresponda

const VerTurnosChofer = () => {
  const [turnos, setTurnos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCodigoUsuario = localStorage.getItem('Codigo_Usuario');
    if (storedCodigoUsuario) {
      fetchData(storedCodigoUsuario);
    } else {
      // Redirigir al login si no hay Codigo_Usuario en localStorage
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async (Codigo_Usuario) => {
    try {
      const response = await fetch(`http://localhost:3001/api/turnos/${Codigo_Usuario}`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      setTurnos(data);
    } catch (error) {
      console.error("Error al obtener la lista de turnos:", error);
    }
  };

  const handleDelete = async (codigoTurno) => {
    console.log("Código de turno a marcar como inactivo:", codigoTurno);
    if (
      window.confirm(
        "¿Estás seguro que deseas marcar este turno como inactivo?"
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/turnos/inactivar/${codigoTurno}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al marcar el turno como inactivo");
        }
        const storedCodigoUsuario = localStorage.getItem('Codigo_Usuario');
        fetchData(storedCodigoUsuario); // Vuelve a obtener la lista de turnos después de la actualización
      } catch (error) {
        console.error("Error al marcar el turno como inactivo:", error);
      }
    }
  };

  const handleAssign = (codigoTurno, numAsientos) => {
    navigate(`/asignarTurno/${codigoTurno}/${numAsientos}`);
  };

  const handleLogoClick = () => {
    const Codigo_Usuario = localStorage.getItem('Codigo_Usuario');
    navigate(`/VistaAdmin/${Codigo_Usuario}`);
  };

  return (
    <div>
      <nav>
        <div className={style.logo} onClick={handleLogoClick}>
          {/* Asegúrate de que tu logo esté aquí */}
          <img src="path-to-your-logo.png" alt="Logo" />
        </div>
      </nav>
      <table className={style.table}>
        <thead>
          <tr>
            <th>Código Turno</th>
            <th>Ruta</th>
            <th>Horario</th>
            <th>Bus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno) => (
            <tr key={turno.Codigo_Turno}>
              <td>{turno.Codigo_Turno}</td>
              <td>{turno.IDRuta}</td>
              <td>{turno.IDHorario}</td>
              <td>{turno.IDBus}</td>
              <td>
                <button onClick={() => handleAssign(turno.Codigo_Turno, turno.Num_Asientos)}>Asignar</button>
                <button onClick={() => handleDelete(turno.Codigo_Turno)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerTurnosChofer;
