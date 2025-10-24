import React, { useEffect } from "react";


export default function PokemonModal({ pokemon, onClose }) {
    useEffect(() => {
        if (!pokemon) return;
        // trap ESC to close
        const h = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [pokemon, onClose]);


    if (!pokemon) return null;


    const { name, image, types, stats, abilities, height, weight, id } = pokemon;


    return (
        <>
            {/* backdrop */}
            <div className="modal-backdrop show" />
            <div
                className="modal fade show"
                style={{ display: "block" }}
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-capitalize">#{id} {name}</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="text-center mb-3">
                                <img src={image} alt={name} style={{ height: 160, objectFit: "contain" }} />
                            </div>


                            <div className="mb-3">
                                <strong>Types:</strong>
                                <div className="d-flex gap-2 flex-wrap mt-1">
                                    {types.map((t) => (
                                        <span key={t} className="badge text-bg-secondary text-capitalize">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="row g-3">
                                <div className="col-6">
                                    <strong>Height:</strong> {height / 10} m
                                </div>
                                <div className="col-6">
                                    <strong>Weight:</strong> {weight / 10} kg
                                </div>
                            </div>

                            <hr />

                            <div className="mb-2">
                                <strong>Abilities</strong>
                                <ul className="mb-0">
                                    {abilities.map((a) => (
                                        <li key={a} className="text-capitalize">{a}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-3">
                                <strong>Base Stats</strong>
                                <div className="list-group mt-2">
                                    {stats.map((s) => (
                                        <div key={s.name} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span className="text-capitalize">{s.name}</span>
                                            <span className="badge text-bg-primary">{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}