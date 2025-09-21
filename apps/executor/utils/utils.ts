export function resolveTemplate(
  template: string,
  context: Record<string, any>,
): string {
  if (!template || typeof template !== "string") {
    return template;
  }

  return template
    .replace(/\{\{\s*\$json\.body\.(\w+)\s*\}\}/g, (match, key) => {
      return context.$json?.body?.[key] || match;
    })
    .replace(
      /\{\{\s*\$node\.(\w+)\.(\w+)\s*\}\}/g,
      (match, nodeId, property) => {
        return context.$node?.[nodeId]?.[property] || match;
      },
    );
}
