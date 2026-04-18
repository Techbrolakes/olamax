import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { getProfile } from "@/lib/db/queries/profiles";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/features/profile/profile-form";
import { AvatarUploader } from "@/components/features/profile/avatar-uploader";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect(ROUTES.auth.signIn);

  const profile = await getProfile(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="You"
        title="Profile"
        description="How others see you across OlaMax."
      />

      <div className="grid gap-10 md:grid-cols-[200px_1fr]">
        <AvatarUploader
          initialUrl={profile?.avatarUrl ?? user.image ?? null}
          fallback={(profile?.fullName ?? user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
        />

        <ProfileForm
          initial={{
            username: profile?.username ?? "",
            fullName: profile?.fullName ?? user.name ?? "",
            bio: profile?.bio ?? "",
          }}
          email={user.email}
        />
      </div>
    </div>
  );
}
