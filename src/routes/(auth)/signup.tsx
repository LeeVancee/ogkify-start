import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/(auth)/signup")({
  component: RouteComponent,
});

function fieldInputClass() {
  return "w-full rounded-lg border-0 bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";
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
      <h1 className="mb-8 text-center text-2xl font-light tracking-tight text-foreground">
        {t("auth.signup.title")}
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
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
          className="shop-pill-button w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              {t("auth.signup.submitting")}
            </>
          ) : (
            t("auth.signup.submit")
          )}
        </button>
      </form>

      {error ? (
        <p className="mt-4 text-center text-sm text-destructive">{error}</p>
      ) : null}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("auth.signup.existingAccountPrompt")}{" "}
        <Link
          to="/login"
          className="text-foreground underline underline-offset-4"
        >
          {t("auth.signup.loginLink")}
        </Link>
      </p>
    </div>
  );
}
