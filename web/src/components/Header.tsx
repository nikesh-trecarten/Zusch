import "./Header.css";
import { Link } from "react-router";
import {
  SignedIn,
  SignedOut,
  SignInButton,
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
          <SignInButton mode="modal">
            <h2>Sign In / Sign Up</h2>
          </SignInButton>
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
