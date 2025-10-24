import React, { useState } from "react";
import PokemonCard from "./PokemonCard.jsx";
import PokemonModal from "./PokemonModal.jsx";


export default function PokemonList({ loading, pokemons }) {
    const [selected, setSelected] = useState(null);


    if (loading) {
        return (
            <div className="d-flex justify-content-center my-5">
                <div className="spinner-border" role="status" aria-label="Loading" />
            </div>
        );
    }


    if (!pokemons?.length) {
        return <p className="text-center mt-4">No Pokémon found.</p>;
    }


    return (
        <>
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3 mt-3">
                {pokemons.map((p) => (
                    <div className="col" key={p.id}>
                        <PokemonCard pokemon={p} onClick={() => setSelected(p)} />
                    </div>
                ))}
            </div>


            <PokemonModal pokemon={selected} onClose={() => setSelected(null)} />
        </>
    );
}