// Utility function to convert snake_case to camelCase
export const snakeToCamel = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

// Function to transform entire objects
export const transformToCamelCase = <T>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map(transformToCamelCase) as T;
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        snakeToCamel(key),
        transformToCamelCase(value),
      ])
    ) as T;
  }

  return obj as T;
};

// Function to convert camelCase to snake_case
export const camelToSnake = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

// Function to transform objects to snake_case
export const transformToSnakeCase = <T>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map(transformToSnakeCase) as T;
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        camelToSnake(key),
        transformToSnakeCase(value),
      ])
    ) as T;
  }

  return obj as T;
};
