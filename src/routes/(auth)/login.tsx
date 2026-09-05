import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { LoaderCircle, Lock, Mail } from "lucide-react";
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
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
});

function fieldInputClass() {
  return "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
}

function RouteComponent() {
  const router = useRouter();
  const { redirect: returnTo } = Route.useSearch();
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: t("auth.login.emailRequired") })
      .email({ message: t("auth.login.emailInvalid") }),
    password: z.string().min(6, {
      message: t("auth.login.passwordMin"),
    }),
  });

  type LoginFormValues = z.infer<typeof formSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setError("");

    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setIsPending(true);
        },
        onSuccess: async () => {
          setIsPending(false);
          toast.success(t("auth.login.success"));
          await queryClient.cancelQueries();
          queryClient.clear();
          await router.invalidate();
          await router.navigate({ href: returnTo });
        },
        onError: (ctx) => {
          setIsPending(false);
          if (!ctx.error.message) {
            throw new Error("Login failed without an error message");
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
          {t("auth.login.title")}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {t("auth.login.subtitle")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  {t("auth.login.emailPlaceholder")}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
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
                <div className="mb-2 flex items-center justify-between gap-3">
                  <FormLabel
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-800"
                  >
                    {t("auth.login.passwordPlaceholder")}
                  </FormLabel>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      type="password"
                      placeholder={t("auth.login.passwordPlaceholder")}
                      className={`${fieldInputClass()} pl-11`}
                      disabled={isPending}
                      autoComplete="current-password"
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
                {t("auth.login.submitting")}
              </>
            ) : (
              <>{t("auth.login.submit")}</>
            )}
          </button>
        </form>
      </Form>

      {error ? (
        <p className="mt-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <p className="mt-6 text-center text-sm text-slate-700">
        {t("auth.login.createAccountPrompt")}{" "}
        <Link
          to="/signup"
          search={{ redirect: returnTo }}
          className="font-medium text-slate-950 transition-colors hover:text-slate-500"
        >
          {t("auth.login.createAccountLink")}
        </Link>
      </p>
    </div>
  );
}
