import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import Header from "./components/Header";
import PokemonCard from "./components/PokemonCard";
import Preloader from "./components/Preloader";
import pokeballIcon from "./images/pokeball.svg";
import {
  fetchPokemonDetail,
  fetchPokemonList,
  MOCK_POKEMON,
  readFavorites,
} from "./utils/pokemonData";
import "./App.css";
import "./vendor/fonts.css";

function App() {
  const [favorites, setFavorites] = useState(readFavorites);

  useEffect(() => {
    localStorage.setItem("pokemon-favorites", JSON.stringify(favorites));
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
        <Header favoritesCount={favorites.length} />

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

  const filteredPokemon = useMemo(
    () =>
      pokemon.filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesType =
          selectedType === "all" || item.types.includes(selectedType);

        return matchesSearch && matchesType;
      }),
    [pokemon, search, selectedType],
  );

  return (
    <main className="page home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Pokédex</p>
          <h1>Discover your next favorite Pokémon</h1>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <img src={pokeballIcon} alt="Pokéball" />
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

      {isLoading && <Preloader message="Loading Pokémon…" />}
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
    return <Preloader message="Loading Pokémon details…" />;
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

export default App;
