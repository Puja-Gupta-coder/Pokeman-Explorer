import { Link } from "react-router-dom";
import "./PokemonCard.css";

export default function PokemonCard({ pokemon, isFavorite, onToggleFavorite }) {
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
