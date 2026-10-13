import React, { useEffect } from "react";
import IdBadge from "./IdBadge";

/**
 * Modal reutilizable de Vista Detalle para todos los módulos de AIROVA.
 * Soporta Modo Claro y Modo Oscuro automáticamente.
 */
const DetailModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon = "fa-circle-info",
  idBadge,
  statusBadge,
  avatar,
  fields = [],
  children,
  primaryAction,
  secondaryAction,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="airova-detail-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="airova-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="airova-detail-header d-flex align-items-start justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            {avatar ? (
              avatar
            ) : (
              <div className="airova-detail-icon">
                <i className={`fa-solid ${icon}`}></i>
              </div>
            )}
            <div>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                {idBadge && (
                  <IdBadge prefix={idBadge.prefix} id={idBadge.id} />
                )}
                {statusBadge}
              </div>
              <h3 className="h5 fw-bold text-dark mb-0">{title}</h3>
              {subtitle && (
                <p className="text-muted small mb-0 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            className="airova-detail-close"
            onClick={onClose}
            aria-label="Cerrar detalle"
            title="Cerrar (Esc)"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="airova-detail-body">
          {fields.length > 0 && (
            <div className="row g-3">
              {fields.map((field, idx) => (
                <div
                  key={idx}
                  className={field.fullWidth ? "col-12" : "col-12 col-sm-6"}
                >
                  <div className="airova-detail-field h-100">
                    <div className="airova-detail-label">
                      {field.icon && (
                        <i className={`fa-solid ${field.icon} me-1 text-primary`}></i>
                      )}
                      <span>{field.label}</span>
                    </div>
                    <div className="airova-detail-value">
                      {field.value !== undefined &&
                      field.value !== null &&
                      field.value !== ""
                        ? field.value
                        : "No registrado"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {children && <div className="mt-3">{children}</div>}
        </div>

        {/* Modal Footer */}
        <div className="airova-detail-footer d-flex flex-wrap justify-content-end align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={onClose}
          >
            Cerrar
          </button>

          {secondaryAction && (
            <button
              type="button"
              className="btn btn-outline-primary px-3 d-flex align-items-center gap-2"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.icon && (
                <i className={`fa-solid ${secondaryAction.icon}`}></i>
              )}
              <span>{secondaryAction.label}</span>
            </button>
          )}

          {primaryAction && (
            <button
              type="button"
              className="btn btn-airova-primary px-4 d-flex align-items-center gap-2"
              onClick={primaryAction.onClick}
            >
              {primaryAction.icon && (
                <i className={`fa-solid ${primaryAction.icon}`}></i>
              )}
              <span>{primaryAction.label}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
