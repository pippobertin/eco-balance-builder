
import { Json } from '../types';

/**
 * Safely parse a JSON string or return a default value if parsing fails
 * Also handles when the input is already an object
 * 
 * @param jsonString The JSON string or object to parse
 * @param defaultValue The default value to return if parsing fails
 * @returns The parsed JSON object or the default value
 */
export const safeJsonParse = <T>(jsonString: string | Json | null | undefined, defaultValue: T): T => {
  if (jsonString === null || jsonString === undefined) {
    console.log('safeJsonParse: input is null or undefined, returning default value');
    return defaultValue;
  }
  
  // If it's already an object (not a string), return it directly
  if (typeof jsonString !== 'string') {
    console.log('safeJsonParse: input is already an object, returning directly');
    return jsonString as unknown as T;
  }
  
  // If it's an empty string, return the default value
  if (jsonString === '') {
    console.log('safeJsonParse: input is an empty string, returning default value');
    return defaultValue;
  }
  
  try {
    // Only try to parse if it's a string
    console.log('safeJsonParse: parsing JSON string');
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON string:', error, 'String value:', jsonString);
    return defaultValue;
  }
};

/**
 * Safely stringify a JSON object or return a default value if stringification fails
 * 
 * @param jsonObject The object to stringify
 * @param defaultValue The default value to return if stringification fails
 * @returns The stringified JSON or the default value
 */
export const safeJsonStringify = (jsonObject: any, defaultValue: string = '{}'): string => {
  try {
    return JSON.stringify(jsonObject);
  } catch (error) {
    console.error('Error stringifying JSON object:', error);
    return defaultValue;
  }
};

/**
 * Prepare a JSON object for storage in the database
 * This handles converting values that might cause issues with Supabase
 * 
 * @param jsonObject The object to prepare
 * @returns The prepared object
 */
export const prepareJsonForDb = (jsonObject: any): any => {
  if (!jsonObject) return {};
  
  // Convert null/undefined to empty values
  const clean = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(item => clean(item));
    }
    
    if (obj !== null && typeof obj === 'object') {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = clean(value);
        return acc;
      }, {} as any);
    }
    
    // Convert null/undefined to empty string or 0 based on context
    if (obj === null || obj === undefined) {
      return '';
    }
    
    return obj;
  };
  
  return clean(jsonObject);
};
