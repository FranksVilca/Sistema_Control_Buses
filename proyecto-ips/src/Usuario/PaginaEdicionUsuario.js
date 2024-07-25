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
    fetch(`http://localhost:3001/api/data/${codigoUsuario}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Asegúrate de que el objeto `img` no se esté incluyendo
        const { img, ...usuarioSinImg } = data;
        usuarioSinImg.Sexo =
          usuarioSinImg.Sexo !== null ? usuarioSinImg.Sexo : 2; // 2 para "Seleccionar"
        setUsuario(usuarioSinImg);
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
    const sexoValue = parseInt(e.target.value, 10); // Asegúrate de convertir el valor a número
    setUsuario((prevState) => ({
      ...prevState,
      Sexo: sexoValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear una copia del objeto usuario sin el campo `img`
    const { img, ...usuarioSinImg } = usuario;

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
        const errorText = await response.text(); // Obtener el texto del error
        throw new Error(`Error al actualizar el usuario: ${errorText}`);
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
    <div className={style.fondo}>
      <header className={style.header}>
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
                className={style.acrear}
                onClick={() => navigate("/InsertarTurno")}
              >
                Crear Turno
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.acrear}
                onClick={() => navigate("/InsertarUsuario")}
              >
                Crear Usuario
              </a>
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
                value={usuario.DNI || ""}
                onChange={handleChange}
              />
            </label>
            <label className={style.label1}>
              Código de Cargo:
              <select
                className={style.select}
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
            <label className={style.label1}>
              Edad:
              <input
                className={style.input}
                type="number"
                name="Edad"
                value={usuario.Edad || ""}
                onChange={handleChange}
              />
            </label>
            <label className={style.label1}>
              Sexo:
              <select
                className={style.select}
                name="Sexo"
                value={
                  usuario.Sexo === 1 ? "1" : usuario.Sexo === 0 ? "0" : "2"
                } // Valor numérico como string
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
                value={usuario.Celular || ""}
                onChange={handleChange}
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
              <input
                className={style.input}
                type="text"
                name="EstadoRegistro"
                value={usuario.EstadoRegistro || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <button className={style.boton} type="submit">
            Actualizar Usuario
          </button>
          <button
            className={style.boton2}
            type="button"
            onClick={() => navigate("/GestionarUsuarios")}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaginaEdicionUsuario;
