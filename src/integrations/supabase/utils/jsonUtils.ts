/**
 * Safely parse JSON string into an object
 * @param jsonString JSON string or object to parse
 * @param defaultValue Default value to return if parsing fails
 * @returns Parsed object or default value
 */
export const safeJsonParse = <T>(jsonString: string | null | undefined | object | number | boolean, defaultValue: T): T => {
  if (jsonString === null || jsonString === undefined) {
    console.log("safeJsonParse: Input is null or undefined, returning default value");
    return defaultValue;
  }
  
  try {
    // If it's already an object (but not a string that looks like an object), return it directly
    if (typeof jsonString === 'object' && jsonString !== null) {
      console.log("safeJsonParse: Input is already an object, returning as-is");
      return jsonString as T;
    }
    
    // If it's a primitive type (number, boolean), wrap it
    if (typeof jsonString === 'number' || typeof jsonString === 'boolean') {
      console.log(`safeJsonParse: Input is primitive type (${typeof jsonString}), converting to desired type`);
      return jsonString as unknown as T;
    }
    
    // Handle string input - this is the most common case when retrieving from Supabase
    if (typeof jsonString === 'string') {
      // Check if it's an empty string
      if (jsonString.trim() === '') {
        console.log("safeJsonParse: Input is empty string, returning default value");
        return defaultValue;
      }
      
      console.log("safeJsonParse: Parsing JSON string");
      const parsedValue = JSON.parse(jsonString);
      return parsedValue as T;
    }
    
    // If we reach here, we're not sure how to handle the input
    console.warn("safeJsonParse: Unhandled input type:", typeof jsonString);
    return defaultValue;
  } catch (error) {
    console.error("Error parsing JSON:", error, "Input was:", jsonString);
    return defaultValue;
  }
};

/**
 * Safely stringify an object to a JSON string
 * @param value Value to stringify (object, array, number, etc)
 * @param defaultValue Default value to return if stringification fails
 * @returns JSON string or default value
 */
export const safeJsonStringify = (value: any, defaultValue: string = '{}'): string => {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  try {
    // If it's already a string and looks like JSON, return it directly
    if (typeof value === 'string') {
      if ((value.startsWith('{') && value.endsWith('}')) || 
          (value.startsWith('[') && value.endsWith(']'))) {
        // Try parsing and re-stringifying to validate and normalize
        JSON.parse(value);
        return value;
      }
    }
    
    // Otherwise stringify the value
    return JSON.stringify(value);
  } catch (error) {
    console.error("Error stringifying value:", error);
    return defaultValue;
  }
};
