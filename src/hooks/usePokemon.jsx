import { useEffect, useMemo, useRef, useState } from "react";
import { fetchPokemonPage, fetchPokemonByName } from "../services/pokeapi.js";


export default function usePokemon({ page, pageSize, query }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const cacheRef = useRef(new Map()); // id -> pokemon


    useEffect(() => {
        let abort = new AbortController();
        (async () => {
            try {
                setLoading(true);
                setError(null);


                if (query) {
                    // try exact by name first for snappy UX
                    const exact = await fetchPokemonByName(query, abort.signal);
                    if (exact) {
                        setData([exact]);
                        setTotal(1);
                        // cache it
                        cacheRef.current.set(exact.id, exact);
                        return;
                    }
                    // fallback to page list (API has no fuzzy search; we show empty)
                    setData([]);
                    setTotal(0);
                    return;
                }


                const { count, results } = await fetchPokemonPage(page, pageSize, abort.signal);
                // merge cache
                results.forEach((p) => cacheRef.current.set(p.id, p));
                setData(results);
                setTotal(count);
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message || String(err));
            } finally {
                setLoading(false);
            }
        })();
        return () => abort.abort();
    }, [page, pageSize, query]);


    const onSearchExact = (name) => {
        // no-op: fetching is handled in useEffect, but we expose this for App to call on submit
    };


    return useMemo(
        () => ({ loading, error, data, total, onSearchExact }),
        [loading, error, data, total]
    );
}