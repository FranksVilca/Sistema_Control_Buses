import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "./PaginaEdicionUsuario.module.css";

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
    const fetchData = async () => {
      try {
        const [usuarioResponse, cargosResponse] = await Promise.all([
          fetch(`http://localhost:3001/api/data/${codigoUsuario}`),
          fetch(`http://localhost:3001/api/cargos`)
        ]);

        if (!usuarioResponse.ok) {
          throw new Error(`Error HTTP: ${usuarioResponse.status}`);
        }

        if (!cargosResponse.ok) {
          throw new Error(`Error HTTP: ${cargosResponse.status}`);
        }

        const usuarioData = await usuarioResponse.json();
        const cargosData = await cargosResponse.json();

        setUsuario((prev) => ({
          ...prev,
          ...usuarioData,
          Sexo: usuarioData.Sexo ?? 2 // Usa el operador de coalescencia nula para manejar valores nulos
        }));
        setCargos(cargosData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
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
    const sexoValue = parseInt(e.target.value, 10);
    setUsuario((prevState) => ({
      ...prevState,
      Sexo: sexoValue,
    }));
  };

  const handleEstadoRegistroChange = (e) => {
    setUsuario((prevState) => ({
      ...prevState,
      EstadoRegistro: e.target.value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Filtra solo números
    const filteredValue = value.replace(/[^0-9]/g, '');
    setUsuario((prevState) => ({
      ...prevState,
      [name]: filteredValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (usuario.DNI.length !== 8) {
      alert("El DNI debe tener exactamente 8 caracteres.");
      return;
    }

    if (usuario.Edad < 18) {
      alert("La edad debe ser mayor de 18 años.");
      return;
    }

    if (usuario.Celular.length !== 9) {
      alert("El celular debe tener exactamente 9 caracteres.");
      return;
    }

    if (!["Activa", "Inactiva"].includes(usuario.EstadoRegistro)) {
      alert("El estado de registro debe ser 'Activa' o 'Inactiva'.");
      return;
    }

    const { img, ...usuarioSinImg } = usuario;

    // Agrega este console.log para verificar los datos enviados
    console.log("Datos a enviar:", usuarioSinImg);

    try {
      const response = await fetch(
        `http://localhost:3001/api/update/${codigoUsuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuarioSinImg),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar el usuario: ${errorText}`);
      }

      alert("Usuario actualizado exitosamente");
      navigate("/GestionarUsuarios");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alert("Hubo un error al actualizar el usuario. Por favor, intenta de nuevo.");
    }
  };

  if (!usuario.Nombre) {
    return <p>Cargando...</p>;
  }

  return (
    <div className={style.fondo}>
      <header className={style.header}>
        <nav className={style.nav}>
          <ul className={style.ul}>
            <li className={style.li}>
              <a className={style.aopciones} href="#">Horario</a>
            </li>
            <li className={style.li}>
              <a className={style.aopciones} href="#">Bus</a>
            </li>
            <li className={style.li}>
              <a className={style.aopciones} href="#">Ruta</a>
            </li>
            <li className={style.li}>
              <a className={style.acrear} href="#">Crear Turno</a>
            </li>
            <li className={style.li}>
              <a className={style.acrear} href="#">Crear Usuario</a>
            </li>
          </ul>
        </nav>
      </header>
      <div className={style.edicionUsuario}>
        <form className={style.formEdicionUsuario} onSubmit={handleSubmit}>
          <h2 className={style.titulo}>Editar Usuario</h2>
          <div className={style.campos}>
            <label className={style.label1}>
              Nombre:
              <input
                className={style.input}
                type="text"
                name="Nombre"
                value={usuario.Nombre || ""}
                onChange={handleChange}
              />
            </label>
            <label className={style.label1}>
              Nombre de Usuario:
              <input
                className={style.input}
                type="text"
                name="Nombre_Usuario"
                value={usuario.Nombre_Usuario || ""}
                onChange={handleChange}
              />
            </label>
            <label className={style.label1}>
              Contraseña:
              <input
                className={style.input}
                type="password"
                name="Contrasena"
                value={usuario.Contrasena || ""}
                onChange={handleChange}
              />
            </label>
            <label className={style.label1}>
              DNI:
              <input
                className={style.input}
                type="text"
                name="DNI"
                maxLength="8" // Limitar la entrada a 8 caracteres
                value={usuario.DNI || ""}
                onInput={handleNumberChange} // Solo permite números
              />
            </label>
            <label className={style.label1}>
              Código de Cargo:
              <select
                className={style.select}
                name="Codigo_Cargo"
                value={usuario.Codigo_Cargo || ""}
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
            <label className={style.label1}>
              Edad:
              <input
                className={style.input}
                type="number"
                name="Edad"
                min="18" // Edad mínima de 18 años
                value={usuario.Edad || ""}
                onChange={handleChange}
              />
            </label>
            <label className={style.label1}>
              Sexo:
              <select
                className={style.select}
                name="Sexo"
                value={usuario.Sexo !== null ? usuario.Sexo.toString() : "2"}
                onChange={handleSexoChange}
              >
                <option value="2">Seleccionar</option>
                <option value="1">Masculino</option>
                <option value="0">Femenino</option>
              </select>
            </label>
            <label className={style.label1}>
              Celular:
              <input
                className={style.input}
                type="text"
                name="Celular"
                maxLength="9" // Limitar la entrada a 9 caracteres
                value={usuario.Celular || ""}
                onInput={handleNumberChange} // Solo permite números
              />
            </label>
            <label className={style.label1}>
              Email:
              <input
                className={style.input}
                type="email"
                name="Email"
                value={usuario.Email || ""}
                onChange={handleChange}
              />
            </label>
            <label className={style.label1}>
              Dirección:
              <input
                className={style.input}
                type="text"
                name="Direccion"
                value={usuario.Direccion || ""}
                onChange={handleChange}
              />
            </label>
            <label className={style.label1}>
              Estado Registro:
              <select
                className={style.select}
                name="EstadoRegistro"
                value={usuario.EstadoRegistro || ""}
                onChange={handleEstadoRegistroChange}
              >
                <option value="">Seleccione un estado</option>
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </label>
          </div>
          <button className={style.boton} type="submit">
            Actualizar Usuario
          </button>
          <button className={style.boton2} type="button" onClick={() => navigate("/GestionarUsuarios")}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default PaginaEdicionUsuario;
