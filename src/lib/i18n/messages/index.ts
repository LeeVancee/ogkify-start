import type { Locale } from "../config";
import { en } from "./en";
import type { Messages } from "./en";
import { zhCN } from "./zh-CN";
import { zhTW } from "./zh-TW";

export const messages = {
  en,
  "zh-TW": zhTW,
  "zh-CN": zhCN,
} as const satisfies Record<Locale, Messages>;

export type MessageTree = typeof en;
