import { SignIn } from "@clerk/clerk-react";

export function LoginPage() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <SignIn path="/login" routing="path" signInUrl="/login" />
    </div>
  );
}
