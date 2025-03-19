/**
 * Safely parse JSON string into an object
 * @param jsonString JSON string or object to parse
 * @param defaultValue Default value to return if parsing fails
 * @returns Parsed object or default value
 */
export const safeJsonParse = <T>(jsonString: string | null | undefined | object | number | boolean, defaultValue: T): T => {
  if (jsonString === null || jsonString === undefined) return defaultValue;
  
  try {
    // If it's already an object, return it directly
    if (typeof jsonString === 'object') {
      return jsonString as T;
    }
    
    // If it's a primitive type (number, boolean), convert it to string first
    if (typeof jsonString === 'number' || typeof jsonString === 'boolean') {
      return JSON.parse(JSON.stringify(jsonString)) as T;
    }
    
    // Otherwise parse it
    return JSON.parse(jsonString as string) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
};
