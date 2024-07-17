import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaginaInsertarUsuario = () => {
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
      const response = await fetch(
        `http://localhost:3001/api/maxCodigoUsuario`
      );
      if (!response.ok) {
        throw new Error("Error al obtener el máximo código de usuario");
      }
      const data = await response.json();
      return data.maxCodigoUsuario;
    } catch (error) {
      console.error("Error al obtener el máximo código de usuario:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validación de campos obligatorios
      if (
        !usuario.Nombre ||
        !usuario.Nombre_Usuario ||
        !usuario.Contrasena ||
        !usuario.DNI ||
        !usuario.Codigo_Cargo ||
        !usuario.Edad ||
        !usuario.Sexo ||
        !usuario.Celular ||
        !usuario.Email ||
        !usuario.Direccion ||
        !usuario.EstadoRegistro
      ) {
        throw new Error("Por favor complete todos los campos");
      }

      // Validación de rango de edad
      const edad = parseInt(usuario.Edad);
      if (edad < 18 || edad > 60) {
        throw new Error("La edad debe estar entre 18 y 60 años");
      }

      // Insertar usuario
      const maxCodigoUsuario = await getMaxCodigoUsuario();
      if (maxCodigoUsuario !== null) {
        const nuevoCodigoUsuario = maxCodigoUsuario + 1;
        const usuarioConCodigo = {
          ...usuario,
          Codigo_Usuario: nuevoCodigoUsuario,
        };
        const response = await fetch(`http://localhost:3001/api/insert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuarioConCodigo),
        });
        if (!response.ok) {
          throw new Error("Error al insertar el usuario");
        }
        alert("Usuario insertado exitosamente");
        navigate("/GestionarUsuarios");
      }
    } catch (error) {
      console.error("Error al insertar el usuario:", error);
    }
  };

  return (
    <div>
      <h2>Insertar Nuevo Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="Nombre"
            value={usuario.Nombre || ""}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label>
          Nombre de Usuario:
          <input
            type="text"
            name="Nombre_Usuario"
            value={usuario.Nombre_Usuario || ""}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            name="Contrasena"
            value={usuario.Contrasena || ""}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label>
          DNI:
          <input
            type="text"
            name="DNI"
            value={usuario.DNI || ""}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label>
          Código de Cargo:
          <select
            name="Codigo_Cargo"
            value={usuario.Codigo_Cargo}
            onChange={handleCargoChange}
            required // Campo obligatorio
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
            required // Campo obligatorio
            min="18"
            max="60"
          />
        </label>
        <label>
          Sexo:
          <select
            name="Sexo"
            value={usuario.Sexo === 1 ? "Masculino" : "Femenino"}
            onChange={handleSexoChange}
            required // Campo obligatorio
          >
            <option value="">Seleccione el sexo</option>
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
            required // Campo obligatorio
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="Email"
            value={usuario.Email || ""}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label>
          Dirección:
          <input
            type="text"
            name="Direccion"
            value={usuario.Direccion || ""}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label>
          Estado de Registro:
          <select
            name="EstadoRegistro"
            value={usuario.EstadoRegistro || ""}
            onChange={handleChange}
            required // Campo obligatorio
          >
            <option value="">Seleccione el estado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </label>
        <button type="submit">Insertar</button>
      </form>
    </div>
  );
};

export default PaginaInsertarUsuario;
