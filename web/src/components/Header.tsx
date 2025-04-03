import "./Header.css";
import { Link } from "react-router";

export function Header() {
  return (
    <>
      <div className="header">
        <h1>
          <Link to="/">Zusch!</Link>
        </h1>
        <h2>
          <Link to="/login">Sign In / Sign Up</Link>
        </h2>
      </div>
    </>
  );
}
