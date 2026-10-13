import React from "react";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  itemLabel = "registros",
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalItems === 0) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Generar números de hojas visibles (máximo 5 botones numéricos a la vez)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="airova-pagination d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 px-4 py-3 border-top">
      <div className="text-muted small d-flex align-items-center gap-2 flex-wrap">
        <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded fw-semibold">
          <i className="fa-solid fa-file-lines me-1"></i>
          Hoja {currentPage} de {totalPages}
        </span>
        <span>
          Mostrando <strong>{startIndex}</strong> – <strong>{endIndex}</strong> de{" "}
          <strong>{totalItems}</strong> {itemLabel} (máx. {itemsPerPage} por hoja)
        </span>
      </div>

      <nav aria-label="Navegación de hojas">
        <ul className="pagination pagination-sm mb-0 gap-1">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link rounded-2"
              onClick={() => handlePageClick(1)}
              disabled={currentPage === 1}
              title="Primera hoja"
            >
              <i className="fa-solid fa-angles-left"></i>
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link rounded-2 px-2"
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
              title="Hoja anterior"
            >
              <i className="fa-solid fa-chevron-left me-1"></i> Ant.
            </button>
          </li>

          {getPageNumbers().map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? "active" : ""}`}
            >
              <button
                type="button"
                className="page-link rounded-2 fw-semibold"
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link rounded-2 px-2"
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Siguiente hoja"
            >
              Sig. <i className="fa-solid fa-chevron-right ms-1"></i>
            </button>
          </li>
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link rounded-2"
              onClick={() => handlePageClick(totalPages)}
              disabled={currentPage === totalPages}
              title="Última hoja"
            >
              <i className="fa-solid fa-angles-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
