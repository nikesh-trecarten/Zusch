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
        <Link className="logo" to="/">
          <img className="logo-image" src="FullLogo_NoBuffer.png" alt="logo" />
          <h1 className="logo-text">ZUSCH!</h1>
        </Link>
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
                className="corner-button"
                src="home-button.png"
                alt="user settings link"
              />
            </Link>
            <SignOutButton>
              <img
                className="corner-button"
                src="signout-button.png"
                alt="signout button"
              />
            </SignOutButton>
          </div>
        </SignedIn>
      </div>
    </>
  );
}
