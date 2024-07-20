import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PaginaEdicionUsuario = () => {
  const { codigoUsuario } = useParams();
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
    EstadoRegistro: "",
  });
  const [cargos, setCargos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/data/${codigoUsuario}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Convertir el valor de Sexo de 1/0 a Masculino/Femenino
        data.Sexo = data.Sexo === 1 ? "Masculino" : "Femenino";
        setUsuario(data);
      })
      .catch((error) => console.error("Error al obtener el usuario:", error));

    fetch(`http://localhost:3001/api/cargos`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setCargos(data))
      .catch((error) => console.error("Error al obtener los cargos:", error));
  }, [codigoUsuario]);

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
    const sexoValue = e.target.value === "Masculino" ? 1 : 0;
    setUsuario((prevState) => ({
      ...prevState,
      Sexo: sexoValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/api/update/${codigoUsuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuario),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }
      alert("Usuario actualizado exitosamente");
      navigate("/GestionarUsuarios");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  // Verificar si usuario está cargado completamente antes de renderizar el formulario
  if (!usuario.Nombre) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Editar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="Nombre"
            value={usuario.Nombre || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Nombre de Usuario:
          <input
            type="text"
            name="Nombre_Usuario"
            value={usuario.Nombre_Usuario || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            name="Contrasena"
            value={usuario.Contrasena || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          DNI:
          <input
            type="text"
            name="DNI"
            value={usuario.DNI || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Código de Cargo:
          <select
            name="Codigo_Cargo"
            value={usuario.Codigo_Cargo}
            onChange={handleCargoChange}
          >
            <option value="">Seleccione un cargo</option>
            {cargos.map((cargo) => (
              <option key={cargo.Codigo_Cargo} value={cargo.Codigo_Cargo}>
                {cargo.Descripcion}
              </option>
            ))}
          </select>
        </label>
        <label>
          Edad:
          <input
            type="number"
            name="Edad"
            value={usuario.Edad || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Sexo:
          <select
            name="Sexo"
            value={usuario.Sexo === 1 ? "Masculino" : "Femenino"}
            onChange={handleSexoChange}
          >
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </label>
        <label>
          Celular:
          <input
            type="text"
            name="Celular"
            value={usuario.Celular || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="Email"
            value={usuario.Email || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Dirección:
          <input
            type="text"
            name="Direccion"
            value={usuario.Direccion || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Estado de Registro:
          <input
            type="text"
            name="EstadoRegistro"
            value={usuario.EstadoRegistro || ""}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default PaginaEdicionUsuario;
