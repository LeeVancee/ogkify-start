import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/(auth)/signup")({
  component: RouteComponent,
});

function fieldInputClass() {
  return "w-full rounded-lg border-0 bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";
}

function RouteComponent() {
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
            toast.success("Account created successfully");
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
        Create Account
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
              if (!value) return "Name is required";
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <input
                id="name"
                type="text"
                placeholder="Name"
                className={fieldInputClass()}
                disabled={isPending}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors.length > 0 ? (
                <p className="mt-2 text-sm text-destructive">{field.state.meta.errors[0]}</p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Email is required";
              if (!/^\S+@\S+$/i.test(value)) return "Please enter a valid email address";
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className={fieldInputClass()}
                disabled={isPending}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors.length > 0 ? (
                <p className="mt-2 text-sm text-destructive">{field.state.meta.errors[0]}</p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Password is required";
              if (value.length < 6) return "Password must be at least 6 characters";
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className={fieldInputClass()}
                disabled={isPending}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors.length > 0 ? (
                <p className="mt-2 text-sm text-destructive">{field.state.meta.errors[0]}</p>
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
              Creating...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      {error ? <p className="mt-4 text-center text-sm text-destructive">{error}</p> : null}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-foreground underline underline-offset-4">
          Sign In
        </Link>
      </p>
    </div>
  );
}
