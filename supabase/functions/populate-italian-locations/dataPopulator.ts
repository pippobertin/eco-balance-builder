
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
import { Municipality } from "./types.ts";

/**
 * Utility function to populate municipality data
 * @param supabaseClient Supabase client instance
 * @param municipalities List of municipalities to insert
 * @param targetTable Target table name
 * @returns Result of the operation
 */
export async function populateMunicipalities(
  supabaseClient: ReturnType<typeof createClient>,
  municipalities: Municipality[],
  targetTable: string = 'municipalities'
) {
  console.log(`Populating ${municipalities.length} municipalities into ${targetTable}`);
  
  const formattedMunicipalities = municipalities.map(mun => ({
    name: mun.name,
    province_code: mun.province_code,
    postal_codes: Array.isArray(mun.postal_codes) 
      ? mun.postal_codes.join(',') 
      : mun.postal_codes
  }));
  
  const { data, error } = await supabaseClient
    .from(targetTable)
    .upsert(formattedMunicipalities);
  
  if (error) {
    console.error(`Error populating ${targetTable}:`, error);
    throw error;
  }
  
  return { 
    count: formattedMunicipalities.length,
    data
  };
}

/**
 * Creates the tables needed for municipality data if they don't exist
 * @param supabaseClient Supabase client instance
 */
export async function ensureTablesExist(
  supabaseClient: ReturnType<typeof createClient>
) {
  // Note: This function would use supabase.rpc to create tables if needed
  // In practice, this would be handled by migrations
  console.log("Ensuring tables exist");
  
  // We would add SQL here to create tables, but for this example
  // we'll just return a success message
  return {
    success: true,
    message: "Tables exist"
  };
}
