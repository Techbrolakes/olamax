import { AuthShell } from "./auth-shell";
import { SignInForm } from "./sign-in-form";
import { isAuthConfigured } from "@/lib/auth/server";

export function SignInView() {
  return (
    <AuthShell eyebrow="Welcome back" title="Sign in" subtitle="Pick up where you left off.">
      <SignInForm configured={isAuthConfigured} />
    </AuthShell>
  );
}
