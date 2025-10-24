import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchPokemonByName, fetchPokemonExtrasByName } from "../services/pokeapi.js";

export default function PokemonDetail() {
  const { name } = useParams();
  const nav = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extras, setExtras] = useState({ games: [], locations: [], evolution: [] });
  const [extrasLoading, setExtrasLoading] = useState(true);

  useEffect(() => {
    let ac = new AbortController();
    (async () => {
      setLoading(true);
      const data = await fetchPokemonByName(name, ac.signal);
      setPokemon(data);
      setLoading(false);
      setExtrasLoading(true);

      const x = await fetchPokemonExtrasByName(name, ac.signal);
      setExtras(x);
      setExtrasLoading(false);
    })();
    return () => ac.abort();
  }, [name]);

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" />
      </div>
    );

  if (!pokemon)
    return (
      <div className="alert alert-warning mt-3">
        Not found. <Link to="/">Go home</Link>
      </div>
    );

  const { id, image, types, stats, abilities, height, weight } = pokemon;

  return (
    <div className="mt-3">
      <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => nav(-1)}>
        ← Back
      </button>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row g-4 align-items-center">
            <div className="col-md-4 text-center">
              <img src={image} alt={name} style={{ height: "clamp(240px, 32vw, 380px)", objectFit: "contain" }} />
            </div>
            <div className="col-md-8">
              <h3 className="text-capitalize mb-1">
                #{id} {name}
              </h3>
              <div className="d-flex gap-2 flex-wrap mb-3">
                <div className="d-flex gap-2 flex-wrap mb-3">
                  {types.map((t) => (
                    <span key={t} className={`badge text-capitalize type-${t.toLowerCase()}`}>{t}</span>
                  ))}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-6">
                  <strong>Height:</strong> {height / 10} m
                </div>
                <div className="col-6">
                  <strong>Weight:</strong> {weight / 10} kg
                </div>
              </div>

              <div className="mt-2 mb-2">
                <h6 className="mb-2">Evolution</h6>
                {extrasLoading ? (
                  <div className="placeholder-glow">
                    <span className="placeholder col-2 me-2"></span>
                    <span className="placeholder col-2 me-2"></span>
                    <span className="placeholder col-2"></span>
                  </div>
                ) : extras.evolution.length ? (
                  <div className="d-flex align-items-center gap-2 flex-wrap flex-md-nowrap overflow-auto pb-2">
                    {extras.evolution.map((level, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && <span className="text-muted mx-1">→</span>}
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          {level.map((sp, i) => {
                            const isCurrent = sp.name.toLowerCase() === name.toLowerCase();
                            return (
                              <React.Fragment key={sp.name}>
                                {i > 0 && <span className="text-muted">/</span>}
                                <Link
                                  to={`/pokemon/${sp.name}`}
                                  className={
                                    "badge text-decoration-none text-capitalize " +
                                    (isCurrent ? "evo-current" : "text-bg-secondary")
                                  }
                                  aria-current={isCurrent ? "true" : undefined}
                                  title={`#${sp.id}`}
                                >
                                  {sp.name}
                                </Link>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">No evolution data.</p>
                )}
              </div>

              {/* Games */}
              <div className="mt-2 mb-2">
                <h6 className="mb-2">Games</h6>
                {extrasLoading ? (
                  <div className="placeholder-glow">
                    <span className="placeholder col-3 me-2"></span>
                    <span className="placeholder col-2 me-2"></span>
                    <span className="placeholder col-4"></span>
                  </div>
                ) : extras.games.length ? (
                  <div className="d-flex flex-wrap gap-2">
                    {extras.games.map((g) => (
                      <span key={g} className="badge text-bg-info text-wrap">{g}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">No game data.</p>
                )}
              </div>

              {/* Horizontal: Locations | Abilities */}
              <div className="row g-4 align-items-start mt-4">
                {/* Locations */}
                <div className="col-12 col-md-6">
                  <h6 className="mb-2">Locations</h6>
                  {extrasLoading ? (
                    <div className="placeholder-glow">
                      <span className="placeholder col-8"></span>
                    </div>
                  ) : extras.locations.length ? (
                    <div className="d-flex flex-wrap gap-2">
                      {extras.locations.map((loc) => (
                        <span key={loc} className="badge text-bg-secondary text-wrap">{loc}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No known wild encounter locations.</p>
                  )}
                </div>

                {/* Abilities */}
                <div className="col-12 col-md-6">
                  <h6 className="mb-2">Abilities</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {abilities.map((a) => (
                      <span key={a} className="badge text-bg-light text-capitalize">{a}</span>
                    ))}
                  </div>
                </div>
              </div>


              <h6 className="mt-4">Base Stats</h6>
              <div className="list-group">
                {stats.map((s) => (
                  <div key={s.name} className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="text-capitalize">{s.name}</span>
                    <span className="badge text-bg-primary">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
