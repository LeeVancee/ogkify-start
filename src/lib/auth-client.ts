import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  // Same-origin requests keep the storefront session on its current host.

  plugins: [adminClient()],
});
