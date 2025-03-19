
/**
 * Safely parses a JSON string
 * @param jsonString The JSON string to parse
 * @param defaultValue The default value to return if parsing fails
 * @returns The parsed JSON object or the default value
 */
export const safeJsonParse = <T>(jsonString: string | null | undefined, defaultValue: T): T => {
  if (!jsonString) return defaultValue;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON string:', error);
    return defaultValue;
  }
};

/**
 * Safely stringifies a JSON object
 * @param jsonObject The object to stringify
 * @returns The stringified JSON or an empty JSON string if stringification fails
 */
export const safeJsonStringify = (jsonObject: any): string => {
  if (!jsonObject) return '{}';
  
  try {
    return JSON.stringify(jsonObject);
  } catch (error) {
    console.error('Error stringifying JSON object:', error);
    return '{}';
  }
};

/**
 * Creates a new object with all nested objects converted to JSON strings
 * @param obj The object to process
 * @returns A new object with all nested objects converted to JSON strings
 */
export const prepareJsonForDb = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      result[key] = null;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      result[key] = safeJsonStringify(value);
    } else if (Array.isArray(value)) {
      result[key] = safeJsonStringify(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
};
