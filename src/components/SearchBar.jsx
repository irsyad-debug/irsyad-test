import React, { useState } from "react";


export default function SearchBar({ onSubmit, defaultValue = "" }) {
    const [text, setText] = useState(defaultValue);


    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(text.trim().toLowerCase());
    };


    return (
        <form className="row g-2" onSubmit={handleSubmit}>
            <div className="col-sm-9 col-md-10">
                <input
                    className="form-control form-control-lg"
                    placeholder="Search Pokémon by name (e.g., pikachu)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <div className="col-sm-3 col-md-2 d-grid">
                <button className="btn btn-lg btn-primary" type="submit">
                    Search
                </button>
            </div>
        </form>
    );
}