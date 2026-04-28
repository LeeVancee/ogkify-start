import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowRight, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/(auth)/signup")({
  component: RouteComponent,
});

function fieldInputClass() {
  return "h-12 w-full rounded-xl border border-slate-200 bg-white px-11 text-sm text-slate-950 shadow-sm transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
}

function RouteComponent() {
  const { t } = useI18n();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          name: value.name,
          password: value.password,
        },
        {
          onRequest: () => {
            setIsPending(true);
          },
          onSuccess: () => {
            setIsPending(false);
            toast.success(t("auth.signup.success"));
            router.navigate({ to: "/login" });
          },
          onError: (ctx) => {
            setIsPending(false);
            if (!ctx.error.message) {
              throw new Error("Signup failed without an error message");
            }
            setError(ctx.error.message);
            toast.error(ctx.error.message);
          },
        },
      );
    },
  });

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-light tracking-tight text-slate-950">
          {t("auth.signup.title")}
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              if (!value) return t("auth.signup.nameRequired");
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                {t("auth.signup.namePlaceholder")}
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  placeholder={t("auth.signup.namePlaceholder")}
                  className={fieldInputClass()}
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
              {field.state.meta.errors.length > 0 ? (
                <p className="mt-2 text-sm text-destructive">
                  {field.state.meta.errors[0]}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) return t("auth.signup.emailRequired");
              if (!/^\S+@\S+$/i.test(value))
                return t("auth.signup.emailInvalid");
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                {t("auth.signup.emailPlaceholder")}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  placeholder={t("auth.signup.emailPlaceholder")}
                  className={fieldInputClass()}
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
              {field.state.meta.errors.length > 0 ? (
                <p className="mt-2 text-sm text-destructive">
                  {field.state.meta.errors[0]}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (!value) return t("auth.signup.passwordRequired");
              if (value.length < 6) return t("auth.signup.passwordMin");
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                {t("auth.signup.passwordPlaceholder")}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  placeholder={t("auth.signup.passwordPlaceholder")}
                  className={fieldInputClass()}
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
              {field.state.meta.errors.length > 0 ? (
                <p className="mt-2 text-sm text-destructive">
                  {field.state.meta.errors[0]}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              {t("auth.signup.submitting")}
            </>
          ) : (
            <>
              {t("auth.signup.submit")}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <p className="mt-8 text-center text-sm text-slate-500">
        {t("auth.signup.existingAccountPrompt")}{" "}
        <Link
          to="/login"
          className="font-semibold text-slate-950 underline underline-offset-4"
        >
          {t("auth.signup.loginLink")}
        </Link>
      </p>
    </div>
  );
}
