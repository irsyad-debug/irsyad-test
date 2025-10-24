import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";                // <-- NEW
import SearchBar from "./components/SearchBar.jsx";
import PokemonList from "./components/PokemonList.jsx";
import Pagination from "./components/Pagination.jsx";
import usePokemon from "./hooks/usePokemon.jsx";
import PokemonDetail from "./pages/PokemonDetail.jsx";       // <-- NEW

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { loading, error, data, total } = usePokemon({ page, pageSize, query });

  function handleSubmit(searchText) {
    setQuery(searchText);
    setPage(1);
  }

  // Home page content (reuses your existing components)
  const Home = (
    <>
      <SearchBar onSubmit={handleSubmit} defaultValue={query} />
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {String(error)}
        </div>
      )}
      <PokemonList loading={loading} pokemons={data} />
      <Pagination
        totalItems={total}
        pageSize={pageSize}
        currentPage={page}
        onChange={(p) => setPage(p)}
      />
    </>
  );

  return (
    <div className="container py-4 bg-body text-body">
      <Navbar />
      <Routes>
        <Route path="/" element={Home} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
        <Route path="*" element={<p className="mt-4">Not found.</p>} />
      </Routes>
      <footer className="text-center text-muted mt-5">
        <small>
          Data from <a href="https://pokeapi.co" target="_blank">PokéAPI</a>
        </small>
      </footer>
    </div>
  );
}
