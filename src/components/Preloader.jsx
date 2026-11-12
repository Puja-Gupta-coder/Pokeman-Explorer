import "./Preloader.css";

export default function Preloader({ message = "Loading Pokémon…" }) {
  return (
    <div className="preloader" aria-live="polite">
      <div className="circle-preloader" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
