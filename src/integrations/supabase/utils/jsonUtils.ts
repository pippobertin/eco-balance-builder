
/**
 * Safely parse JSON string into an object
 * @param jsonString JSON string or object to parse
 * @param defaultValue Default value to return if parsing fails
 * @returns Parsed object or default value
 */
export const safeJsonParse = <T>(jsonString: string | null | undefined | object | number | boolean, defaultValue: T): T => {
  if (jsonString === null || jsonString === undefined) return defaultValue;
  
  try {
    // Se è già un oggetto, ritornalo direttamente
    if (typeof jsonString === 'object') {
      return jsonString as T;
    }
    
    // Se è un tipo primitivo (numero, booleano), convertilo prima in stringa
    if (typeof jsonString === 'number' || typeof jsonString === 'boolean') {
      return JSON.parse(JSON.stringify(jsonString)) as T;
    }
    
    // Altrimenti fai il parsing
    return JSON.parse(jsonString as string) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
};
