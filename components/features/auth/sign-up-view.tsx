import { AuthShell } from "./auth-shell";
import { SignUpForm } from "./sign-up-form";
import { isAuthConfigured } from "@/lib/auth/server";

export function SignUpView() {
  return (
    <AuthShell
      eyebrow="Start collecting"
      title="Create an account"
      subtitle="Watchlists, reviews, and a place to keep them."
    >
      <SignUpForm configured={isAuthConfigured} />
    </AuthShell>
  );
}
