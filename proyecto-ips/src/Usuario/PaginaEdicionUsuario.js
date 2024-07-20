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
    img: null, // Añadido para la imagen
  });
  const [cargos, setCargos] = useState([]);
  const [imgPreview, setImgPreview] = useState(null); // Vista previa de la imagen
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
        // Mostrar vista previa de la imagen si existe
        if (data.img) {
          setImgPreview(`http://localhost:3001/api/images/${data.img}`); // Ajustar URL según tu configuración
        }
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Mostrar vista previa de la imagen
      setImgPreview(URL.createObjectURL(file));
      setUsuario((prevState) => ({
        ...prevState,
        img: file,
      }));
    }
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
      const formData = new FormData();
      formData.append("Nombre", usuario.Nombre);
      formData.append("Nombre_Usuario", usuario.Nombre_Usuario);
      formData.append("Contrasena", usuario.Contrasena);
      formData.append("DNI", usuario.DNI);
      formData.append("Codigo_Cargo", usuario.Codigo_Cargo);
      formData.append("Edad", usuario.Edad);
      formData.append("Sexo", usuario.Sexo);
      formData.append("Celular", usuario.Celular);
      formData.append("Email", usuario.Email);
      formData.append("Direccion", usuario.Direccion);
      formData.append("EstadoRegistro", usuario.EstadoRegistro);
      if (usuario.img) {
        formData.append("img", usuario.img);
      }

      const response = await fetch(
        `http://localhost:3001/api/update/${codigoUsuario}`,
        {
          method: "PUT",
          body: formData,
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
        <label>
          Imagen:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        {imgPreview && (
          <div>
            <h3>Vista Previa:</h3>
            <img src={imgPreview} alt="Vista previa" width="200" />
          </div>
        )}
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default PaginaEdicionUsuario;
