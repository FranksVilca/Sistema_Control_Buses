import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "./PaginaEdicionBuses.module.css"; // Asegúrate de tener este archivo CSS

const PaginaEdicionBus = () => {
  const { idBus } = useParams();
  const [bus, setBus] = useState({
    Num_Asientos: "",
    EstadoRegistro: "",
    Modelo: "",
    Marca: "",
    Placa: "",
  });
  const [estados, setEstados] = useState(["Activo", "Inactivo", "Mantenimiento"]); // Ejemplo de estados
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/bus/${idBus}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setBus(data))
      .catch((error) => console.error("Error al obtener el bus:", error));
  }, [idBus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que todos los campos estén llenos
    if (
      !bus.Num_Asientos ||
      !bus.EstadoRegistro ||
      !bus.Modelo ||
      !bus.Marca ||
      !bus.Placa
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/update/bus/${idBus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bus),
        }
      );
      if (!response.ok) {
        const errorText = await response.text(); // Obtener el texto del error
        throw new Error(`Error al actualizar el bus: ${errorText}`);
      }
      alert("Bus actualizado exitosamente");
      navigate("/ComponenteGestorBuses");
    } catch (error) {
      console.error("Error al actualizar el bus:", error);
    }
  };

  // Verificar si el bus está cargado completamente antes de renderizar el formulario
  if (!bus.Num_Asientos) {
    return <p>Cargando...</p>;
  }

  return (
    <div className={style.fondo}>
      <header className={style.header}>
        <nav className={style.nav}>
          <ul className={style.ul}>
            <li className={style.li}><a className={style.aopciones} href="#">Horario</a></li>
            <li className={style.li}><a className={style.aopciones} href="#">Bus</a></li>
            <li className={style.li}><a className={style.aopciones} href="#">Ruta</a></li>
            <li className={style.li}><a className={style.acrear} href="#">Crear Turno</a></li>
            <li className={style.li}><a className={style.acrear} href="#">Crear Usuario</a></li>
          </ul>
        </nav>
      </header>
      <div className={style.edicionBus}>
        <form className={style.formEdicionBus} onSubmit={handleSubmit}>
          <h2 className={style.titulo}>Editar Bus</h2>
          <div className={style.campos}>
            <label className={style.label1}>
              Número de Asientos:
              <input
                className={style.input}
                type="number"
                name="Num_Asientos"
                value={bus.Num_Asientos || ""}
                onChange={handleChange}
                min="1" // Solo números positivos
              />
            </label>
            <label className={style.label1}>
              Estado Registro:
              <select
                className={style.input}
                name="EstadoRegistro"
                value={bus.EstadoRegistro || ""}
                onChange={handleChange}
              >
                <option value="">Seleccione un estado</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </label>
            <label className={style.label1}>
              Modelo:
              <input
                className={style.input}
                type="text"
                name="Modelo"
                value={bus.Modelo || ""}
                onChange={handleChange}
              />
            </label>
            <label className={style.label1}>
              Marca:
              <input
                className={style.input}
                type="text"
                name="Marca"
                value={bus.Marca || ""}
                onChange={handleChange}
              />
            </label>
            <label className={style.label1}>
              Placa:
              <input
                className={style.input}
                type="text"
                name="Placa"
                value={bus.Placa || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <button className={style.boton} type="submit">
            Actualizar Bus
          </button>
          <button className={style.boton2} type="button" onClick={() => navigate("/ComponenteGestorBuses")}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaginaEdicionBus;
