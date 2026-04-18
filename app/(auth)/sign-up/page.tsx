import type { Metadata } from "next";
import { SignUpView } from "@/components/features/auth/sign-up-view";

export const metadata: Metadata = { title: "Create an account" };

export default function SignUpPage() {
  return <SignUpView />;
}
