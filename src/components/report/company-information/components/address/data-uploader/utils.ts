
import { ItalianMunicipality } from './types';

// Parse CSV to array of objects
export const parseCSV = (text: string): ItalianMunicipality[] => {
  // Split by lines
  const lines = text.split('\n');
  
  // If there's a header row, get column names from it
  const header = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
  
  const results: ItalianMunicipality[] = [];
  
  // Start from index 1 to skip header
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    
    const values = lines[i].split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
    
    // Create an object mapping headers to values
    const obj: any = {};
    header.forEach((key, index) => {
      obj[key] = values[index];
    });
    
    // Only add if we have the minimum required fields
    if (obj.denominazione_ita && obj.sigla_provincia) {
      results.push({
        denominazione_ita: obj.denominazione_ita,
        cap: obj.cap || "",
        sigla_provincia: obj.sigla_provincia,
        denominazione_provincia: obj.denominazione_provincia || ""
      });
    }
  }
  
  return results;
};

// Process JSON data, handling common formatting issues
export const processJsonData = (text: string): ItalianMunicipality[] => {
  try {
    // Try to parse the JSON data
    const textWithBrackets = text.startsWith('[') 
      ? text 
      : `[${text}]`;
    
    return JSON.parse(textWithBrackets);
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
    
    // Try to fix common JSON formatting issues
    let fixedText = text;
    
    // If the file doesn't start with '[', add it
    if (!fixedText.trim().startsWith('[')) {
      fixedText = '[' + fixedText;
    }
    
    // If the file doesn't end with ']', add it
    if (!fixedText.trim().endsWith(']')) {
      fixedText = fixedText + ']';
    }
    
    // Replace any trailing commas before closing brackets
    fixedText = fixedText.replace(/,\s*\]/g, ']');
    
    // Try parsing again with the fixed text
    try {
      return JSON.parse(fixedText);
    } catch (secondError) {
      console.error('Error parsing JSON after fixing:', secondError);
      throw new Error('Il file JSON non è nel formato corretto. Verifica la struttura del file.');
    }
  }
};

// Group municipalities by name and province code to consolidate postal codes
export const consolidateMunicipalities = (municipalities: any[]): any[] => {
  const municipalityMap = new Map();
  
  municipalities.forEach(municipality => {
    const key = `${municipality.name}-${municipality.province_code}`;
    if (municipalityMap.has(key)) {
      const existing = municipalityMap.get(key);
      // Add the postal code if it's not already in the list
      if (municipality.postal_codes[0] && !existing.postal_codes.includes(municipality.postal_codes[0])) {
        existing.postal_codes.push(municipality.postal_codes[0]);
      }
    } else {
      municipalityMap.set(key, { ...municipality });
    }
  });
  
  // Convert the map back to an array
  return Array.from(municipalityMap.values());
};
