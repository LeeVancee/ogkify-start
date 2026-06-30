import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { LoaderCircle, Lock, Mail, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { authQueryKeys } from "@/lib/auth-query";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/(auth)/signup")({
  component: RouteComponent,
});

function fieldInputClass() {
  return "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
}

function RouteComponent() {
  const { t } = useI18n();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const formSchema = z.object({
    name: z.string().min(1, { message: t("auth.signup.nameRequired") }),
    email: z
      .string()
      .min(1, { message: t("auth.signup.emailRequired") })
      .email({ message: t("auth.signup.emailInvalid") }),
    password: z.string().min(6, {
      message: t("auth.signup.passwordMin"),
    }),
  });

  type SignupFormValues = z.infer<typeof formSchema>;

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: SignupFormValues) => {
    setError("");

    await authClient.signUp.email(
      {
        email: values.email,
        name: values.name,
        password: values.password,
      },
      {
        onRequest: () => {
          setIsPending(true);
        },
        onSuccess: async () => {
          setIsPending(false);
          toast.success(t("auth.signup.success"));
          await queryClient.invalidateQueries({
            queryKey: authQueryKeys.session(),
          });
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
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[2.1rem] font-semibold tracking-tight text-slate-950">
          {t("auth.signup.title")}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {t("auth.signup.subtitle")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  {t("auth.signup.namePlaceholder")}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="name"
                      type="text"
                      placeholder={t("auth.signup.namePlaceholder")}
                      className={`${fieldInputClass()} pl-11`}
                      disabled={isPending}
                      autoComplete="name"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="mt-2 text-sm text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  {t("auth.signup.emailPlaceholder")}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder="contact@bundui.com"
                      className={`${fieldInputClass()} pl-11`}
                      disabled={isPending}
                      autoComplete="email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="mt-2 text-sm text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  {t("auth.signup.passwordPlaceholder")}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      type="password"
                      placeholder={t("auth.signup.passwordPlaceholder")}
                      className={`${fieldInputClass()} pl-11`}
                      disabled={isPending}
                      autoComplete="new-password"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="mt-2 text-sm text-destructive" />
              </FormItem>
            )}
          />

          <button
            type="submit"
            disabled={isPending}
            className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0d0d12] px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                {t("auth.signup.submitting")}
              </>
            ) : (
              <>{t("auth.signup.submit")}</>
            )}
          </button>
        </form>
      </Form>

      <div className="my-8 flex items-center gap-4 text-slate-500">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-sm">{t("auth.signup.continueWith")}</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="space-y-4">
        {socialButton({
          label: "Google",
          onClick: () => toast.info(t("auth.signup.socialUnavailable")),
          icon: googleIcon(),
        })}
        {socialButton({
          label: "GitHub",
          onClick: () => toast.info(t("auth.signup.socialUnavailable")),
          icon: githubIcon(),
        })}
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <p className="mt-6 text-center text-sm text-slate-700">
        {t("auth.signup.existingAccountPrompt")}{" "}
        <Link
          to="/login"
          className="font-medium text-slate-950 underline underline-offset-4"
        >
          {t("auth.signup.loginLink")}
        </Link>
      </p>
    </div>
  );
}

function socialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-slate-50"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function googleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.98h5.37c-.23 1.5-1.86 4.4-5.37 4.4-3.24 0-5.88-2.68-5.88-5.98s2.64-5.98 5.88-5.98c1.84 0 3.07.79 3.78 1.47l2.58-2.49C16.71 3.98 14.6 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.2 0 8.65-3.65 8.65-8.8 0-.59-.06-1.04-.15-1.5Z"
      />
    </svg>
  );
}

function githubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.83c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.56 1.42.21 2.47.11 2.73.64.72 1.03 1.63 1.03 2.75 0 3.95-2.35 4.82-4.58 5.07.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z"
      />
    </svg>
  );
}
