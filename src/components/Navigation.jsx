import { Link } from "react-router-dom";
import "./Navigation.css";

export default function Navigation({ favoritesCount }) {
  return (
    <nav className="nav" aria-label="Main navigation">
      <Link to="/" className="nav-link">
        Home
      </Link>
      <Link to="/favorites" className="nav-link">
        Favorites ({favoritesCount})
      </Link>
    </nav>
  );
}
