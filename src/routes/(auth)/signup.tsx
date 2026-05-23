import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowRight, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { useMemo, useState } from "react";
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
  return "h-12 w-full rounded-xl border border-slate-200 bg-white px-11 text-sm text-slate-950 shadow-sm transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
}

function RouteComponent() {
  const { t } = useI18n();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, { message: t("auth.signup.nameRequired") }),
        email: z
          .string()
          .min(1, { message: t("auth.signup.emailRequired") })
          .email({ message: t("auth.signup.emailInvalid") }),
        password: z.string().min(6, {
          message: t("auth.signup.passwordMin"),
        }),
      }),
    [t],
  );

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
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-light tracking-tight text-slate-950">
          {t("auth.signup.title")}
        </h1>
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
                  className="mb-2 block text-sm font-medium text-slate-700"
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
                      className={fieldInputClass()}
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
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t("auth.signup.emailPlaceholder")}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder={t("auth.signup.emailPlaceholder")}
                      className={fieldInputClass()}
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
                  className="mb-2 block text-sm font-medium text-slate-700"
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
                      className={fieldInputClass()}
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
      </Form>

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
