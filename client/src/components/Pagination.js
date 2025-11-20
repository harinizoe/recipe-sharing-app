import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, hasNextPage, hasPrevPage, totalRecipes } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="glass-card p-3">
        <div className="d-flex align-items-center gap-2">
          {/* Previous Button */}
          <button
            className={`btn btn-sm ${hasPrevPage ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map(page => (
            <button
              key={page}
              className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            className={`btn btn-sm ${hasNextPage ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
        
        {/* Results Info */}
        <div className="text-center mt-2">
          <small className="text-muted">
            Showing page {currentPage} of {totalPages} ({totalRecipes} total recipes)
          </small>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
