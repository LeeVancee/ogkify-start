import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  AlertCircle,
  LoaderCircle,
  Lock,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import type { SetStateAction } from "react";

import { CloudinaryImageUpload } from "@/components/dashboard/forms/cloudinary-image-upload";
import { DashboardPageShell } from "@/components/dashboard/layout/page-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminQueryKeys } from "@/lib/admin/query-options";
import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";

interface SettingsSession {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
  };
}

interface DashboardSettingsPageProps {
  initialSession: SettingsSession | null;
}

function useSettingsState(session: SettingsSession | null) {
  const [state, setState] = useState({
    profileValues: {
      name: session?.user.name ?? "",
      image: session?.user.image ?? "",
    },
    passwordValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    profilePending: false,
    passwordPending: false,
    profileMessage: "",
    passwordMessage: "",
    profileError: "",
    passwordError: "",
  });
  const setField = <K extends keyof typeof state>(
    key: K,
    value: SetStateAction<(typeof state)[K]>,
  ) =>
    setState((current) => ({
      ...current,
      [key]: typeof value === "function" ? value(current[key]) : value,
    }));
  return {
    ...state,
    setProfileValues: (value: SetStateAction<typeof state.profileValues>) =>
      setField("profileValues", value),
    setPasswordValues: (value: SetStateAction<typeof state.passwordValues>) =>
      setField("passwordValues", value),
    setProfilePending: (value: SetStateAction<boolean>) =>
      setField("profilePending", value),
    setPasswordPending: (value: SetStateAction<boolean>) =>
      setField("passwordPending", value),
    setProfileMessage: (value: SetStateAction<string>) =>
      setField("profileMessage", value),
    setPasswordMessage: (value: SetStateAction<string>) =>
      setField("passwordMessage", value),
    setProfileError: (value: SetStateAction<string>) =>
      setField("profileError", value),
    setPasswordError: (value: SetStateAction<string>) =>
      setField("passwordError", value),
  };
}

export function DashboardSettingsPage({
  initialSession,
}: DashboardSettingsPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const queryClient = useQueryClient();
  const sessionQuery = authClient.useSession();
  const session = sessionQuery.data ?? initialSession;
  const {
    profileValues,
    passwordValues,
    profilePending,
    passwordPending,
    profileMessage,
    passwordMessage,
    profileError,
    passwordError,
    setProfileValues,
    setPasswordValues,
    setProfilePending,
    setPasswordPending,
    setProfileMessage,
    setPasswordMessage,
    setProfileError,
    setPasswordError,
  } = useSettingsState(session);

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");

    const name = profileValues.name.trim();
    if (name.length < 2) {
      setProfileError(t("dashboard.settings.nameMin"));
      return;
    }

    await authClient.updateUser(
      {
        name,
        image: profileValues.image.trim() || null,
      },
      {
        onRequest: () => setProfilePending(true),
        onSuccess: async () => {
          setProfilePending(false);
          setProfileMessage(t("dashboard.settings.profileUpdated"));
          await Promise.all([
            sessionQuery.refetch(),
            queryClient.invalidateQueries({
              queryKey: adminQueryKeys.session(),
            }),
            router.invalidate(),
          ]);
        },
        onError: (ctx) => {
          setProfilePending(false);
          setProfileError(
            ctx.error.message || t("dashboard.settings.profileUpdateFailed"),
          );
        },
      },
    );
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (
      passwordValues.currentPassword.length < 6 ||
      passwordValues.newPassword.length < 6 ||
      passwordValues.confirmPassword.length < 6
    ) {
      setPasswordError(t("dashboard.settings.passwordMin"));
      return;
    }

    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setPasswordError(t("dashboard.settings.passwordMismatch"));
      return;
    }

    await authClient.changePassword(
      {
        currentPassword: passwordValues.currentPassword,
        newPassword: passwordValues.newPassword,
        revokeOtherSessions: true,
      },
      {
        onRequest: () => setPasswordPending(true),
        onSuccess: () => {
          setPasswordPending(false);
          setPasswordMessage(t("dashboard.settings.passwordChanged"));
          setPasswordValues({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
        onError: (ctx) => {
          setPasswordPending(false);
          setPasswordError(
            ctx.error.message || t("dashboard.settings.passwordChangeFailed"),
          );
        },
      },
    );
  }

  const userInitial = session?.user.name?.[0]?.toUpperCase() ?? "U";

  return (
    <DashboardPageShell title={t("dashboard.nav.settings")}>
      <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <form
          onSubmit={handleProfileSubmit}
          className="flex min-h-0 flex-col gap-4 rounded-xl border bg-card p-4 md:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <User className="size-4" />
                {t("dashboard.settings.profile")}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("dashboard.settings.profileDescription")}
              </p>
            </div>
            <Button type="submit" disabled={profilePending} className="gap-2">
              {profilePending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {t("dashboard.settings.saveProfile")}
            </Button>
          </div>

          <div className="grid flex-1 content-start gap-5 lg:grid-cols-[12rem_minmax(0,1fr)]">
            <div className="h-fit rounded-xl border bg-background p-4">
              <Avatar className="mx-auto size-20">
                {profileValues.image ? (
                  <AvatarImage
                    src={profileValues.image}
                    alt={profileValues.name}
                  />
                ) : null}
                <AvatarFallback className="text-2xl">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 text-center">
                <div className="font-medium">
                  {session?.user.name ?? t("dashboard.settings.adminUser")}
                </div>
                <div className="mt-1 truncate text-xs text-muted-foreground">
                  {session?.user.email ?? t("dashboard.settings.noEmail")}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <Field label={t("dashboard.settings.name")}>
                <Input
                  value={profileValues.name}
                  onChange={(event) =>
                    setProfileValues((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  disabled={profilePending}
                  placeholder={t("dashboard.settings.yourName")}
                />
              </Field>

              <Field label={t("dashboard.settings.avatar")}>
                <CloudinaryImageUpload
                  value={profileValues.image ? [profileValues.image] : []}
                  onChange={(images) =>
                    setProfileValues((current) => ({
                      ...current,
                      image: images[0] ?? "",
                    }))
                  }
                  maxFiles={1}
                  disabled={profilePending}
                  imageAlt={
                    profileValues.name || t("dashboard.settings.profileAvatar")
                  }
                  showPreview={false}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("dashboard.settings.email")}>
                  <Input value={session?.user.email ?? ""} disabled readOnly />
                </Field>
                <Field label={t("dashboard.settings.role")}>
                  <Input
                    value={session?.user.role ?? "user"}
                    disabled
                    readOnly
                  />
                </Field>
              </div>

              <FormMessage message={profileMessage} error={profileError} />
            </div>
          </div>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="flex flex-col gap-4 rounded-xl border bg-card p-4 md:p-5"
        >
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Shield className="size-4" />
              {t("dashboard.settings.security")}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("dashboard.settings.securityDescription")}
            </p>
          </div>

          <div className="space-y-4">
            <Field label={t("dashboard.settings.currentPassword")}>
              <PasswordInput
                value={passwordValues.currentPassword}
                disabled={passwordPending}
                onChange={(value) =>
                  setPasswordValues((current) => ({
                    ...current,
                    currentPassword: value,
                  }))
                }
              />
            </Field>
            <Field label={t("dashboard.settings.newPassword")}>
              <PasswordInput
                value={passwordValues.newPassword}
                disabled={passwordPending}
                onChange={(value) =>
                  setPasswordValues((current) => ({
                    ...current,
                    newPassword: value,
                  }))
                }
              />
            </Field>
            <Field label={t("dashboard.settings.confirmNewPassword")}>
              <PasswordInput
                value={passwordValues.confirmPassword}
                disabled={passwordPending}
                onChange={(value) =>
                  setPasswordValues((current) => ({
                    ...current,
                    confirmPassword: value,
                  }))
                }
              />
            </Field>
          </div>

          <FormMessage message={passwordMessage} error={passwordError} />

          <Button
            type="submit"
            disabled={passwordPending}
            className="mt-auto gap-2"
          >
            {passwordPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Lock className="size-4" />
            )}
            {t("dashboard.settings.changePassword")}
          </Button>
        </form>
      </div>
    </DashboardPageShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function PasswordInput({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      type="password"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      minLength={6}
    />
  );
}

function FormMessage({ message, error }: { message: string; error: string }) {
  if (!message && !error) return null;

  return (
    <div
      className={
        error
          ? "flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          : "rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300"
      }
    >
      {error ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : null}
      <span>{error || message}</span>
    </div>
  );
}
