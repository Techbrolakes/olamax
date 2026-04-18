import type { Metadata } from "next";
import { AccountView } from "@/components/features/auth/account-view";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return <AccountView />;
}
