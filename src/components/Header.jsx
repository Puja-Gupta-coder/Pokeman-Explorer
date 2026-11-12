import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import pokeballIcon from "../images/pokeball.svg";
import "./Header.css";

export default function Header({ favoritesCount }) {
  return (
    <header className="topbar">
      <div className="brand-wrap">
        <Link to="/" className="brand-link">
          <img src={pokeballIcon} alt="Pokéball" className="brand-mark" />
          <span>Pokemon Explorer</span>
        </Link>
      </div>

      <Navigation favoritesCount={favoritesCount} />
    </header>
  );
}
