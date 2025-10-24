const API = "https://pokeapi.co/api/v2";

const idFromUrl = (url) => {
    const m = String(url).match(/\/(\d+)\/?$/);
    return m ? Number(m[1]) : null;
};
const titleize = (s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function mapPokemon(dto) {
    return {
        id: dto.id,
        name: dto.name,
        height: dto.height,
        weight: dto.weight,
        image:
            dto.sprites?.other?.["official-artwork"]?.front_default ||
            dto.sprites?.front_default ||
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png",
        types: dto.types?.map((t) => t.type?.name) || [],
        abilities: dto.abilities?.map((a) => a.ability?.name) || [],
        stats: dto.stats?.map((s) => ({ name: s.stat?.name, value: s.base_stat })) || []
    };
}


export async function fetchPokemonPage(page = 1, pageSize = 12, signal) {
    const offset = (page - 1) * pageSize;
    const res = await fetch(`${API}/pokemon?offset=${offset}&limit=${pageSize}`, { signal });
    if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
    const json = await res.json();


    // get details for each on the page
    const detailed = await Promise.all(
        json.results.map(async (item) => {
            const r = await fetch(item.url, { signal });
            if (!r.ok) throw new Error(`Failed to load Pokémon details`);
            const dto = await r.json();
            return mapPokemon(dto);
        })
    );

    return { count: json.count, results: detailed };
}

export async function fetchPokemonByName(name, signal) {
    if (!name) return null;
    const res = await fetch(`${API}/pokemon/${encodeURIComponent(name.toLowerCase())}`, { signal });
    if (!res.ok) return null; // treat as not found
    const dto = await res.json();
    return mapPokemon(dto);
}

export async function fetchPokemonExtrasByName(name, signal) {
    // Get main pokemon to resolve id
    const baseRes = await fetch(`${API}/pokemon/${encodeURIComponent(name.toLowerCase())}`, { signal });
    if (!baseRes.ok) return { games: [], locations: [], evolution: [] };
    const baseDto = await baseRes.json();

    // 1) Games (versions) from game_indices
    const games = Array.from(
        new Set((baseDto.game_indices || []).map((g) => g.version?.name).filter(Boolean))
    ).map(titleize);

    // 2) Locations (encounters)
    const locRes = await fetch(`${API}/pokemon/${baseDto.id}/encounters`, { signal });
    let locations = [];
    if (locRes.ok) {
        const enc = await locRes.json();
        locations = Array.from(
            new Set(enc.map((e) => e.location_area?.name).filter(Boolean))
        )
            .slice(0, 40) // keep it reasonable
            .map(titleize);
    }

    // 3) Evolution chain (via species -> evolution_chain)
    let evolution = [];
    const speciesRes = await fetch(`${API}/pokemon-species/${baseDto.id}`, { signal });
    if (speciesRes.ok) {
        const speciesDto = await speciesRes.json();
        const evoUrl = speciesDto?.evolution_chain?.url;
        if (evoUrl) {
            const evoRes = await fetch(evoUrl, { signal });
            if (evoRes.ok) {
                const evoDto = await evoRes.json();
                // Build levels: array of arrays (branches per stage)
                const levels = [];
                const queue = [{ node: evoDto.chain, depth: 0 }];
                while (queue.length) {
                    const { node, depth } = queue.shift();
                    if (!levels[depth]) levels[depth] = [];
                    levels[depth].push({
                        name: node.species?.name,
                        id: idFromUrl(node.species?.url),
                    });
                    (node.evolves_to || []).forEach((child) => queue.push({ node: child, depth: depth + 1 }));
                }
                evolution = levels; // e.g., [[{name:'pichu',id:..}], [{name:'pikachu'}], [{name:'raichu'}]]
            }
        }
    }

    return { games, locations, evolution };
}
