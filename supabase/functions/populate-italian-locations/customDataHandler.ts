
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
import { corsHeaders } from "./constants.ts";
import { RequestData, Municipality } from "./types.ts";

/**
 * Handles uploading custom municipality data
 * @param supabaseClient Supabase client instance
 * @param requestData Request data containing custom municipalities
 * @returns Response with operation result
 */
export async function handleCustomData(
  supabaseClient: ReturnType<typeof createClient>,
  requestData: RequestData
): Promise<Response> {
  if (!requestData.customData || !requestData.customData.municipalities || !Array.isArray(requestData.customData.municipalities) || requestData.customData.municipalities.length === 0) {
    return new Response(
      JSON.stringify({ error: 'No valid custom municipalities data provided' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { municipalities } = requestData.customData;
  const targetTable = requestData.targetTable || 'municipalities';
  console.log(`Received ${municipalities.length} custom municipalities for ${targetTable}`);
  
  // Clear existing municipalities if requested
  if (requestData.clearExisting) {
    console.log(`Clearing existing municipalities from ${targetTable} as requested`);
    await supabaseClient.from(targetTable).delete().neq('id', 0);
  }
  
  // Format municipalities for database insertion based on target table
  let formattedMunicipalities;
  if (targetTable === 'mun') {
    formattedMunicipalities = municipalities.map(m => ({
      name: m.name,
      province_code: m.province_code,
      postal_codes: m.postal_codes // Should already be a string for 'mun' table
    }));
  } else {
    // For 'municipalities' table, postal_codes should be an array
    formattedMunicipalities = municipalities.map(m => ({
      name: m.name,
      province_code: m.province_code,
      postal_codes: Array.isArray(m.postal_codes) ? m.postal_codes : m.postal_codes.split(',')
    }));
  }
  
  // Insert in batches of 1000 to avoid request size limits
  const batchSize = 1000;
  for (let i = 0; i < formattedMunicipalities.length; i += batchSize) {
    const batch = formattedMunicipalities.slice(i, i + batchSize);
    const { error } = await supabaseClient.from(targetTable).insert(batch);
    
    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1} into ${targetTable}:`, error);
      return new Response(
        JSON.stringify({ error: `Failed to insert municipalities batch ${i / batchSize + 1}: ${error.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }
  
  return new Response(
    JSON.stringify({ 
      message: `Custom municipalities uploaded successfully to ${targetTable}`, 
      count: formattedMunicipalities.length 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
