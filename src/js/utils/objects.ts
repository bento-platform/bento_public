export const caseInsensitiveObjectAccess = <T>(key: string, obj: Record<string, T>): T | undefined => {
  const casedKey = Object.keys(obj).find((k) => k.toLowerCase() === key.toLowerCase());
  return casedKey ? obj[casedKey] : undefined;
};
