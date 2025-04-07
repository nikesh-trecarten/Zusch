import "./Header.css";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  SignOutButton,
} from "@clerk/clerk-react";

export function Header() {
  return (
    <>
      <div className="header">
        <h1>
          <Link to="/">Zusch!</Link>
        </h1>
        <SignedOut>
          <div className="clerk-buttons">
            <SignInButton mode="modal">
              <h2>Sign In</h2>
            </SignInButton>
            <SignUpButton forceRedirectUrl={"/register"} mode="modal">
              <h2>Sign Up</h2>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <SignOutButton>
            <h2>Sign Out</h2>
          </SignOutButton>
        </SignedIn>
      </div>
    </>
  );
}
