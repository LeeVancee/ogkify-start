import { z } from "zod";

export function safeReturnTo(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\r\n]/.test(value)
  )
    return "/";
  return value;
}
export const authSearchSchema = z.object({
  redirect: z
    .string()
    .optional()
    .transform((value) => safeReturnTo(value)),
});
