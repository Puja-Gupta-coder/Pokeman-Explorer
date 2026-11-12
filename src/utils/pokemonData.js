export const STORAGE_KEY = "pokemon-favorites";
export const API_BASE = "https://pokeapi.co/api/v2";

export const MOCK_POKEMON = [
  {
    id: 1,
    name: "bulbasaur",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    types: ["grass", "poison"],
    height: 0.7,
    weight: 6.9,
    abilities: ["overgrow", "chlorophyll"],
    stats: [
      { name: "hp", value: 45 },
      { name: "attack", value: 49 },
      { name: "defense", value: 49 },
      { name: "special-attack", value: 65 },
      { name: "special-defense", value: 65 },
      { name: "speed", value: 45 },
    ],
  },
  {
    id: 4,
    name: "charmander",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
    types: ["fire"],
    height: 0.6,
    weight: 8.5,
    abilities: ["blaze", "solar-power"],
    stats: [
      { name: "hp", value: 39 },
      { name: "attack", value: 52 },
      { name: "defense", value: 43 },
      { name: "special-attack", value: 60 },
      { name: "special-defense", value: 50 },
      { name: "speed", value: 65 },
    ],
  },
  {
    id: 7,
    name: "squirtle",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    types: ["water"],
    height: 0.5,
    weight: 9,
    abilities: ["torrent", "rain-dish"],
    stats: [
      { name: "hp", value: 44 },
      { name: "attack", value: 48 },
      { name: "defense", value: 65 },
      { name: "special-attack", value: 50 },
      { name: "special-defense", value: 64 },
      { name: "speed", value: 43 },
    ],
  },
  {
    id: 25,
    name: "pikachu",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    types: ["electric"],
    height: 0.4,
    weight: 6,
    abilities: ["static", "lightning-rod"],
    stats: [
      { name: "hp", value: 35 },
      { name: "attack", value: 55 },
      { name: "defense", value: 40 },
      { name: "special-attack", value: 50 },
      { name: "special-defense", value: 50 },
      { name: "speed", value: 90 },
    ],
  },
  {
    id: 39,
    name: "jigglypuff",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
    types: ["normal", "fairy"],
    height: 0.5,
    weight: 5.5,
    abilities: ["cute-charm", "competitive"],
    stats: [
      { name: "hp", value: 115 },
      { name: "attack", value: 45 },
      { name: "defense", value: 20 },
      { name: "special-attack", value: 45 },
      { name: "special-defense", value: 25 },
      { name: "speed", value: 20 },
    ],
  },
];

export const readFavorites = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const normalizePokemon = (details) => ({
  id: details.id,
  name: details.name,
  sprite: details.sprites.other["official-artwork"].front_default,
  types: details.types.map((entry) => entry.type.name),
  height: details.height / 10,
  weight: details.weight / 10,
  abilities: details.abilities.map((entry) => entry.ability.name),
  stats: details.stats.map((entry) => ({
    name: entry.stat.name,
    value: entry.base_stat,
  })),
});

export const fetchPokemonList = async () => {
  try {
    const response = await fetch(`${API_BASE}/pokemon?limit=151`);

    if (!response.ok) {
      throw new Error("Live API unavailable");
    }

    const data = await response.json();
    const detailedPokemon = await Promise.all(
      data.results.map(async (item) => {
        const itemResponse = await fetch(item.url);

        if (!itemResponse.ok) {
          throw new Error("Unable to load Pokémon details");
        }

        const details = await itemResponse.json();
        return normalizePokemon(details);
      }),
    );

    return detailedPokemon;
  } catch {
    return MOCK_POKEMON;
  }
};

export const fetchPokemonDetail = async (name) => {
  try {
    const response = await fetch(`${API_BASE}/pokemon/${name}`);

    if (!response.ok) {
      throw new Error("Unable to load Pokémon details");
    }

    const details = await response.json();
    return normalizePokemon(details);
  } catch {
    const foundPokemon = MOCK_POKEMON.find(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );

    if (!foundPokemon) {
      throw new Error("No Pokémon found.");
    }

    return foundPokemon;
  }
};
