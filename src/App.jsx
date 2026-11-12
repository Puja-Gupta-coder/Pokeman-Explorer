import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import "./App.css";

const STORAGE_KEY = "pokemon-favorites";
const API_BASE = "https://pokeapi.co/api/v2";

const MOCK_POKEMON = [
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

const readFavorites = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const normalizePokemon = (details) => ({
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

const fetchPokemonList = async () => {
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

const fetchPokemonDetail = async (name) => {
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

function App() {
  const [favorites, setFavorites] = useState(readFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (pokemon) => {
    setFavorites((currentFavorites) => {
      const alreadySaved = currentFavorites.some(
        (item) => item.id === pokemon.id,
      );

      if (alreadySaved) {
        return currentFavorites.filter((item) => item.id !== pokemon.id);
      }

      return [...currentFavorites, pokemon];
    });
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand-wrap">
            <Link to="/" className="brand-link">
              <span className="brand-mark">⚡</span>
              Pokemon Explorer
            </Link>
          </div>

          <nav className="nav" aria-label="Main navigation">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/favorites" className="nav-link">
              Favorites ({favorites.length})
            </Link>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <FavoritesPage
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/pokemon/:name"
            element={
              <PokemonDetailPage
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function HomePage({ favorites, onToggleFavorite }) {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [demoNotice, setDemoNotice] = useState("");

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setIsLoading(true);
        const details = await fetchPokemonList();
        setPokemon(details);
        setError("");

        if (
          details.length === MOCK_POKEMON.length &&
          details[0]?.name === MOCK_POKEMON[0]?.name
        ) {
          setDemoNotice(
            "Demo data is active because the live API is unavailable.",
          );
        } else {
          setDemoNotice("");
        }
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPokemon();
  }, []);

  const types = useMemo(
    () => ["all", ...new Set(pokemon.flatMap((item) => item.types))],
    [pokemon],
  );

  const filteredPokemon = useMemo(() => {
    return pokemon.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType =
        selectedType === "all" || item.types.includes(selectedType);

      return matchesSearch && matchesType;
    });
  }, [pokemon, search, selectedType]);

  return (
    <main className="page home-page">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Pokédex</p>
          <h1>Discover your next favorite Pokémon</h1>
        </div>

        <div className="hero-actions">
          <input
            type="search"
            value={search}
            placeholder="Search by name"
            className="search-input"
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search Pokémon"
          />

          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            className="type-filter"
            aria-label="Filter Pokémon by type"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All types" : type}
              </option>
            ))}
          </select>
        </div>
      </section>

      {isLoading && <p className="status-message">Loading Pokémon…</p>}
      {demoNotice && <p className="status-message info">{demoNotice}</p>}
      {error && <p className="status-message error">{error}</p>}

      {!isLoading && !error && (
        <section className="card-grid">
          {filteredPokemon.length > 0 ? (
            filteredPokemon.map((item) => (
              <PokemonCard
                key={item.id}
                pokemon={item}
                isFavorite={favorites.some(
                  (favorite) => favorite.id === item.id,
                )}
                onToggleFavorite={onToggleFavorite}
              />
            ))
          ) : (
            <p className="status-message empty">
              No Pokémon match your search.
            </p>
          )}
        </section>
      )}
    </main>
  );
}

function FavoritesPage({ favorites, onToggleFavorite }) {
  return (
    <main className="page favorites-page">
      <section className="section-header">
        <div>
          <p className="eyebrow">Favorites</p>
          <h2>Your saved Pokémon</h2>
        </div>
      </section>

      {favorites.length === 0 ? (
        <p className="status-message empty">
          You haven’t saved any Pokémon yet. Add some from the home page.
        </p>
      ) : (
        <section className="card-grid">
          {favorites.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isFavorite
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </section>
      )}
    </main>
  );
}

function PokemonDetailPage({ favorites, onToggleFavorite }) {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [demoNotice, setDemoNotice] = useState("");

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setIsLoading(true);
        const details = await fetchPokemonDetail(name);
        setPokemon(details);
        setError("");

        if (
          details.id === MOCK_POKEMON[0].id ||
          details.name === MOCK_POKEMON[0].name
        ) {
          setDemoNotice(
            "Demo details are displayed because the live API is unavailable.",
          );
        } else {
          setDemoNotice("");
        }
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPokemon();
  }, [name]);

  if (isLoading) {
    return <p className="status-message">Loading Pokémon details…</p>;
  }

  if (demoNotice) {
    return (
      <main className="page detail-page">
        <Link to="/" className="back-link">
          ← Back to Pokédex
        </Link>
        <p className="status-message info">{demoNotice}</p>
        {error && <p className="status-message error">{error}</p>}
      </main>
    );
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  if (!pokemon) {
    return <p className="status-message empty">No Pokémon found.</p>;
  }

  const isFavorite = favorites.some((item) => item.id === pokemon.id);

  return (
    <main className="page detail-page">
      <Link to="/" className="back-link">
        ← Back to Pokédex
      </Link>

      <section className="detail-card">
        <div className="detail-image-wrap">
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="detail-image"
          />
        </div>

        <div className="detail-content">
          <div className="detail-topline">
            <div>
              <p className="eyebrow">#{String(pokemon.id).padStart(3, "0")}</p>
              <h2>{pokemon.name}</h2>
            </div>
            <button
              type="button"
              className="favorite-button"
              onClick={() => onToggleFavorite(pokemon)}
            >
              {isFavorite ? "Remove favorite" : "Save favorite"}
            </button>
          </div>

          <div className="type-row">
            {pokemon.types.map((type) => (
              <span key={type} className="type-badge">
                {type}
              </span>
            ))}
          </div>

          <div className="metrics-grid">
            <div>
              <span>Height</span>
              <strong>{pokemon.height} m</strong>
            </div>
            <div>
              <span>Weight</span>
              <strong>{pokemon.weight} kg</strong>
            </div>
          </div>

          <div className="stats-block">
            <h3>Stats</h3>
            <ul className="stats-list">
              {pokemon.stats.map((stat) => (
                <li key={stat.name}>
                  <div className="stat-label-row">
                    <span>{stat.name}</span>
                    <span>{stat.value}</span>
                  </div>
                  <div className="stat-bar">
                    <span style={{ width: `${(stat.value / 255) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="abilities-block">
            <h3>Abilities</h3>
            <div className="ability-list">
              {pokemon.abilities.map((ability) => (
                <span key={ability} className="ability-pill">
                  {ability}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PokemonCard({ pokemon, isFavorite, onToggleFavorite }) {
  return (
    <article className="pokemon-card">
      <button
        type="button"
        className="favorite-toggle"
        aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
        onClick={() => onToggleFavorite(pokemon)}
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      <Link to={`/pokemon/${pokemon.name}`} className="pokemon-link">
        <img src={pokemon.sprite} alt={pokemon.name} className="card-image" />
      </Link>

      <div className="card-text">
        <p className="card-index">#{String(pokemon.id).padStart(3, "0")}</p>
        <Link to={`/pokemon/${pokemon.name}`} className="pokemon-link">
          <h3>{pokemon.name}</h3>
        </Link>

        <div className="type-row">
          {pokemon.types.map((type) => (
            <span key={`${pokemon.id}-${type}`} className="type-badge">
              {type}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default App;
