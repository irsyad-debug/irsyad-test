import React from "react";


export default function Pagination({ totalItems, pageSize, currentPage, onChange }) {
    const totalPages = Math.max(1, Math.ceil((totalItems || 0) / pageSize));
    if (totalPages <= 1) return null;


    const pages = [];
    const maxButtons = 5; // compact window
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);


    for (let p = start; p <= end; p++) pages.push(p);


    return (
        <nav className="mt-4 d-flex justify-content-center">
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => onChange(1)}>« First</button>
                </li>
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => onChange(currentPage - 1)}>‹ Prev</button>
                </li>


                {pages.map((p) => (
                    <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
                        <button className="page-link" onClick={() => onChange(p)}>{p}</button>
                    </li>
                ))}


                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => onChange(currentPage + 1)}>Next ›</button>
                </li>
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => onChange(totalPages)}>Last »</button>
                </li>
            </ul>
        </nav>
    );
}