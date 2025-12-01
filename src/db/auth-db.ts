import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env/server";
import * as schema from "./schema";

// Drizzle connection for Better Auth only
const driver = postgres(env.DATABASE_URL);

export const drizzleDb = drizzle({ client: driver, schema });
