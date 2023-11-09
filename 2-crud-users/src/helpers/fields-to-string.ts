export const fieldsToString = <T>(fields: T[]) =>
  fields.map((field) => `"${field}"`).join(', ');
