type Primitive = string | number | boolean | null | undefined;
type MessageNode = Primitive | { readonly [key: string]: MessageNode };

export type TranslationValues = Record<string, string | number>;

export function translate(
  messages: MessageNode,
  key: string,
  values: TranslationValues = {},
): string {
  const template = key.split(".").reduce<MessageNode>((current, part) => {
    if (!current || typeof current !== "object" || !(part in current)) {
      return undefined;
    }

    return current[part];
  }, messages);

  if (typeof template !== "string") {
    return key;
  }

  return interpolate(template, values);
}

export function interpolate(
  template: string,
  values: TranslationValues,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, name: string) => {
    const value = values[name];
    return value === undefined ? match : String(value);
  });
}
