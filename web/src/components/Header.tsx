import styles from "./Header.module.css";
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
      <div className={styles.header}>
        <Link className={styles.logo} to="/">
          <img
            className={styles.logoImage}
            src="FullLogo_NoBuffer.png"
            alt="logo"
          />
          <h1 className={styles.logoText}>ZUSCH!</h1>
        </Link>
        <SignedOut>
          <div className={styles.cornerButtons}>
            <SignInButton mode="modal">
              <h2 className={styles.clerkButton}>Sign In</h2>
            </SignInButton>
            <SignUpButton forceRedirectUrl={"/register"} mode="modal">
              <h2 className={styles.clerkButton}>Sign Up</h2>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className={styles.cornerButtons}>
            <UserButton />
            <Link to="/settings">
              <img
                className={styles.cornerButton}
                src="gear.png"
                alt="user settings link"
              />
            </Link>
            <SignOutButton>
              <img
                className={styles.cornerButton}
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
