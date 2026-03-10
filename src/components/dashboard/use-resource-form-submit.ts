import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

interface UseResourceFormSubmitOptions<
  TValues,
  TResult extends { success: boolean; error?: string },
> {
  mutationFn: (values: TValues) => Promise<TResult>;
  queryKey: string[];
  successMessage: string;
  errorMessage?: string;
  redirectTo: string;
}

export function useResourceFormSubmit<
  TValues,
  TResult extends { success: boolean; error?: string },
>({
  mutationFn,
  queryKey,
  successMessage,
  errorMessage = "Operation failed",
  redirectTo,
}: UseResourceFormSubmitOptions<TValues, TResult>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return async (values: TValues) => {
    try {
      const result = await mutationFn(values);

      if (!result.success) {
        toast.error(result.error || errorMessage);
        return;
      }

      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey });
      router.navigate({ to: redirectTo });
    } catch (error) {
      toast.error(errorMessage);
    }
  };
}
