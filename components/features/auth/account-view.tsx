"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { PageHeader } from "@/components/shared/page-header";
import { AvatarUploader } from "@/components/features/profile/avatar-uploader";
import { ProfileForm } from "@/components/features/profile/profile-form";

type Props = {
  user: { email: string; name: string | null };
  profile: {
    avatarUrl: string | null;
    username: string;
    fullName: string;
    bio: string;
  };
  fallback: string;
};

export function AccountView({ user, profile, fallback }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Settings"
        title="Account"
        description="Update your profile, avatar, and session."
      />

      <div className="grid gap-10 md:grid-cols-[200px_1fr]">
        <div className="space-y-6">
          <AvatarUploader initialUrl={profile.avatarUrl} fallback={fallback} />
          <div className="space-y-3 border-t border-border/60 pt-6 md:border-t-0 md:pt-0">
            <p className="meta-label">Session</p>
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border/60 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>

        <ProfileForm
          initial={{
            username: profile.username,
            fullName: profile.fullName,
            bio: profile.bio,
          }}
          email={user.email}
        />
      </div>
    </div>
  );
}
