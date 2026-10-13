import React from "react";

/**
 * Formatea un ID numérico con prefijo empresarial y ceros a la izquierda.
 * Ejemplo: formatId(4, "BUS") => "BUS-004"
 */
export const formatId = (id, prefix = "ID", digits = 3) => {
  if (id === undefined || id === null || id === "") return `${prefix}-000`;
  const padded = String(id).padStart(digits, "0");
  return `${prefix}-${padded}`;
};

/**
 * Componente visual de píldora estilizada para mostrar IDs con formato empresarial.
 */
const IdBadge = ({ id, prefix = "ID", digits = 3, className = "" }) => {
  if (id === undefined || id === null || id === "") return null;
  const padded = String(id).padStart(digits, "0");

  return (
    <span className={`airova-id-badge ${className}`} title={`Código interno: ${prefix}-${padded}`}>
      <span className="airova-id-prefix">{prefix}</span>
      <span className="airova-id-sep">-</span>
      <span className="airova-id-number">{padded}</span>
    </span>
  );
};

export default IdBadge;
