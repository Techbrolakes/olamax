import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { getProfile } from "@/lib/db/queries/profiles";
import { AccountView } from "@/components/features/auth/account-view";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect(ROUTES.auth.signIn);

  const profile = await getProfile(user.id);
  const fallback = (profile?.fullName ?? user.name ?? user.email ?? "?").charAt(0).toUpperCase();

  return (
    <AccountView
      user={{ email: user.email, name: user.name ?? null }}
      profile={{
        avatarUrl: profile?.avatarUrl ?? user.image ?? null,
        username: profile?.username ?? "",
        fullName: profile?.fullName ?? user.name ?? "",
        bio: profile?.bio ?? "",
      }}
      fallback={fallback}
    />
  );
}
