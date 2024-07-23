// D:\Nueva carpeta\Sistema_Control_Buses\proyecto-ips\src\Usuario\PaginaInsertarUsuario.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fileTypeFromBuffer } from "file-type";
import style from "./PaginaInsertarUsuario.module.css";

const PaginaInsertarUsuario = () => {
  const [usuario, setUsuario] = useState({
    Nombre: "",
    Nombre_Usuario: "",
    Contrasena: "",
    DNI: "",
    Codigo_Cargo: "",
    Edad: "",
    Sexo: "", // Inicialmente vacío
    Celular: "",
    Email: "",
    Direccion: "",
    EstadoRegistro: "",
    img: null, // Añadido para la imagen
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

  // Función para manejar la cancelación
  const handleCancel = () => {
    setUsuario({
      Nombre: "",
      Nombre_Usuario: "",
      Contrasena: "",
      DNI: "",
      Codigo_Cargo: "",
      Edad: "",
      Sexo: "", // Inicialmente vacío
      Celular: "",
      Email: "",
      Direccion: "",
      EstadoRegistro: "",
      img: null, // Añadido para la imagen
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateImageFile = async (fileBuffer) => {
    if (fileBuffer) {
      const fileType = await fileTypeFromBuffer(fileBuffer);
      if (!fileType || !fileType.mime.startsWith("image/")) {
        throw new Error("El archivo subido no es una imagen válida");
      }
    }
  };

  const handleFileChange = (e) => {
    setUsuario((prevState) => ({
      ...prevState,
      img: e.target.files[0], // Guardar el archivo seleccionado
    }));
  };

  const handleCargoChange = (e) => {
    setUsuario((prevState) => ({
      ...prevState,
      Codigo_Cargo: e.target.value,
    }));
  };

  const handleSexoChange = (e) => {
    // Asegúrate de que los valores sean 'Masculino' o 'Femenino'
    const sexoValue =
      e.target.value === "Masculino"
        ? 1
        : e.target.value === "Femenino"
        ? 0
        : 2;
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
        usuario.Sexo === "" || // Asegúrate de que el campo Sexo tenga un valor válido
        !usuario.Celular ||
        !usuario.Email ||
        !usuario.Direccion ||
        !usuario.img ||
        !usuario.EstadoRegistro
      ) {
        throw new Error("Por favor complete todos los campos");
      }

      // Validación del valor de Sexo
      if (usuario.Sexo === 2) {
        throw new Error("El valor del sexo no es válido");
      }

      // Validación de rango de edad
      const edad = parseInt(usuario.Edad);
      if (isNaN(edad) || edad < 18 || edad > 60) {
        throw new Error("La edad debe estar entre 18 y 60 años");
      }

      // Validación del archivo de imagen
      const file = usuario.img;
      if (file) {
        const buffer = await file.arrayBuffer();
        const type = await fileTypeFromBuffer(new Uint8Array(buffer));
        if (!type || !type.mime.startsWith("image/")) {
          alert("El archivo subido no es una imagen válida");
          return;
        }
      }

      // Obtener el máximo código de usuario
      const maxCodigoUsuario = await getMaxCodigoUsuario();
      if (maxCodigoUsuario !== null) {
        const nuevoCodigoUsuario = maxCodigoUsuario + 1;

        // Crear un FormData para enviar los datos junto con la imagen
        const formData = new FormData();
        formData.append("Codigo_Usuario", nuevoCodigoUsuario);
        for (const key in usuario) {
          formData.append(key, usuario[key]);
        }

        // Realizar la solicitud para insertar el usuario
        const response = await fetch(`http://localhost:3001/api/insert`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Error al insertar el usuario");
        }
        alert("Usuario insertado exitosamente");
        navigate("/GestionarUsuarios");
      }
    } catch (error) {
      alert(`Error al insertar el usuario: ${error.message}`); // Mostrar error en alerta
      console.error("Error al insertar el usuario:", error);
    }
  };

  return (
    <div className={style.fondo}>
      <header className={style.header}>
        <nav className={style.nav}>
          <ul className={style.ul}>
            <li className={style.li}>
              <a className={style.aopciones} href="#">
                Horario
              </a>
            </li>
            <li className={style.li}>
              <a className={style.aopciones} href="#">
                Bus
              </a>
            </li>
            <li className={style.li}>
              <a className={style.aopciones} href="#">
                Ruta
              </a>
            </li>
            <li className={style.li}>
              <a className={style.acrear} href="#">
                Crear Turno
              </a>
            </li>
            <li className={style.li}>
              <a className={style.acrear} href="#">
                Crear Usuario
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <div className={style.insertarUsuario}>
        <form className={style.formInsertarUsuario} onSubmit={handleSubmit}>
          <h2 className={style.titulo}>Insertar Nuevo Usuario</h2>
          <div className={style.campos}>
            <label className={style.label1}>
              Nombre:
              <input
                className={style.input}
                type="text"
                name="Nombre"
                value={usuario.Nombre || ""}
                onChange={handleChange}
                required // Campo obligatorio
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
                required // Campo obligatorio
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
                required // Campo obligatorio
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
                required // Campo obligatorio
              />
            </label>
            <label className={style.label1}>
              Código de Cargo:
              <select
                className={style.select}
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
            <label className={style.label1}>
              Edad:
              <input
                className={style.input}
                type="number"
                name="Edad"
                value={usuario.Edad || ""}
                onChange={handleChange}
                required // Campo obligatorio
                min="18"
                max="60"
              />
            </label>
            <label className={style.label1}>
              Sexo:
              <select
                className={style.select}
                name="Sexo"
                value={
                  usuario.Sexo === 1
                    ? "Masculino"
                    : usuario.Sexo === 0
                    ? "Femenino"
                    : ""
                }
                onChange={handleSexoChange}
                required // Campo obligatorio
              >
                <option value="">Seleccione el sexo</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
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
                required // Campo obligatorio
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
                required // Campo obligatorio
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
                required // Campo obligatorio
              />
            </label>
            <label className={style.label1}>
              Estado de Registro:
              <select
                className={style.select}
                name="EstadoRegistro"
                value={usuario.EstadoRegistro || ""}
                onChange={handleChange}
                required // Campo obligatorio
              >
                <option value="">Seleccione un estado</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </label>
            <label className={style.label1}>
              Imagen:
              <input
                className={style.input}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </label>
          </div>
          <div className={style.botones}>
            <button className={style.boton1} type="submit">
              Insertar
            </button>
            <button
              className={style.boton2}
              type="submit"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaginaInsertarUsuario;
