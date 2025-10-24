import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider.jsx";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const active = ({ isActive }) => "nav-link" + (isActive ? " active fw-semibold" : "");

  return (
    <nav className="navbar navbar-expand-lg bg-danger rounded-3 px-3 mb-4">
      <div className="container-fluid px-0">
        <Link className="navbar-brand fw-bold" to="/">Pokédex</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmain">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navmain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink end to="/" className={active}>Home</NavLink></li>
            <li className="nav-item"><a className="nav-link" href="https://pokeapi.co/" target="_blank">PokéAPI</a></li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            <span className="badge text-bg-light">{theme === "dark" ? "Dark" : "Light"}</span>
            <button className="btn btn-outline-light btn-sm" onClick={toggleTheme}>Toggle Theme</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
