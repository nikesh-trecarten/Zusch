import "./Header.css";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";

export function Header() {
  return (
    <>
      <div className="header">
        <h1>
          <Link to="/">Z!</Link>
        </h1>
        <SignedOut>
          <div className="corner-buttons">
            <SignInButton mode="modal">
              <h2>Sign In</h2>
            </SignInButton>
            <SignUpButton forceRedirectUrl={"/register"} mode="modal">
              <h2>Sign Up</h2>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="corner-buttons">
            <UserButton />
            <Link to="/settings">
              <img
                className="user-settings-link"
                src="home-button.png"
                alt="user settings link"
              />
            </Link>
            <SignOutButton>
              <h2>Sign Out</h2>
            </SignOutButton>
          </div>
        </SignedIn>
      </div>
    </>
  );
}
