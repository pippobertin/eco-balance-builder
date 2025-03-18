
/**
 * Safely parse JSON string into an object
 * @param jsonString JSON string to parse
 * @param defaultValue Default value to return if parsing fails
 * @returns Parsed object or default value
 */
export const safeJsonParse = <T>(jsonString: string | null | undefined, defaultValue: T): T => {
  if (!jsonString) return defaultValue;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
};
