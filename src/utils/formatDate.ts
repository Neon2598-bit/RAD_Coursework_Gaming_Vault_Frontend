export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
