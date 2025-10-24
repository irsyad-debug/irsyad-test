import React from "react";
import { Link } from "react-router-dom";

export default function PokemonCard({ pokemon }) {
  const { name, image, types, id } = pokemon;
  const primary = (types?.[0] || "normal").toLowerCase();

  return (
    <Link to={`/pokemon/${name}`} className="text-decoration-none">
      <div className={`card h-100 shadow-sm border-0 type-${primary}`} role="button">
        <img
          src={image}
          className="card-img-top bg-light"
          alt={name}
          style={{ objectFit: "contain", height: 140 }}
        />
        <div className="card-body">
          <h6 className="card-title text-capitalize mb-1 text-body">#{id} {name}</h6>
          <div className="d-flex gap-1 flex-wrap">
            {types.map((t) => (
              <span key={t} className={`badge text-capitalize type-${t.toLowerCase()}`}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
