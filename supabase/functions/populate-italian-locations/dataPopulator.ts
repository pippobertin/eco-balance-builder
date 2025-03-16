import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
import { corsHeaders, provinces, defaultMunicipalities } from "./constants.ts";
import { RequestData } from "./types.ts";

/**
 * Populates the database with provinces and municipalities data
 * @param supabaseClient Supabase client instance
 * @param targetTable Target table for storing municipalities
 * @returns Response with operation result
 */
export async function populateData(
  supabaseClient: ReturnType<typeof createClient>,
  targetTable: string
): Promise<Response> {
  // First check if we already have data
  const { count: provinceCount, error: countError } = await supabaseClient
    .from('provinces')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error checking province count:', countError);
    return new Response(
      JSON.stringify({ error: `Failed to check existing provinces: ${countError.message}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Check if we have municipalities data
  const { count: municipalityCount, error: municipalityCountError } = await supabaseClient
    .from(targetTable)
    .select('*', { count: 'exact', head: true });

  if (municipalityCountError) {
    console.error(`Error checking municipality count in ${targetTable}:`, municipalityCountError);
    return new Response(
      JSON.stringify({ error: `Failed to check existing municipalities: ${municipalityCountError.message}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // If provinces exist but municipalities don't, only populate municipalities
  if (provinceCount && provinceCount > 0 && (!municipalityCount || municipalityCount === 0)) {
    // Format municipalities for the target table
    let formattedMunicipalities;
    if (targetTable === 'mun') {
      formattedMunicipalities = defaultMunicipalities;
    } else {
      // Convert string postal_codes to arrays for 'municipalities' table
      formattedMunicipalities = defaultMunicipalities.map(m => ({
        name: m.name,
        province_code: m.province_code,
        postal_codes: typeof m.postal_codes === 'string' ? m.postal_codes.split(',') : m.postal_codes
      }));
    }
    
    // Insert municipalities
    const { error: municipalitiesError } = await supabaseClient
      .from(targetTable)
      .insert(formattedMunicipalities);

    if (municipalitiesError) {
      console.error(`Error inserting municipalities into ${targetTable}:`, municipalitiesError);
      return new Response(
        JSON.stringify({ error: `Failed to insert municipalities: ${municipalitiesError.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: `Municipalities populated successfully in ${targetTable}`, 
        count: formattedMunicipalities.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // If both provinces and municipalities exist, return information
  if (provinceCount && provinceCount > 0 && municipalityCount && municipalityCount > 0) {
    return new Response(
      JSON.stringify({ 
        message: `Data already populated in ${targetTable}`, 
        provinceCount, 
        municipalityCount 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Otherwise, populate both provinces and municipalities
  // Insert provinces
  const { error: provincesError } = await supabaseClient
    .from('provinces')
    .insert(provinces);

  if (provincesError) {
    console.error('Error inserting provinces:', provincesError);
    return new Response(
      JSON.stringify({ error: `Failed to insert provinces: ${provincesError.message}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Format municipalities for the target table
  let formattedMunicipalities;
  if (targetTable === 'mun') {
    formattedMunicipalities = defaultMunicipalities;
  } else {
    // Convert string postal_codes to arrays for 'municipalities' table
    formattedMunicipalities = defaultMunicipalities.map(m => ({
      name: m.name,
      province_code: m.province_code,
      postal_codes: typeof m.postal_codes === 'string' ? m.postal_codes.split(',') : m.postal_codes
    }));
  }

  // Insert municipalities
  const { error: municipalitiesError } = await supabaseClient
    .from(targetTable)
    .insert(formattedMunicipalities);

  if (municipalitiesError) {
    console.error(`Error inserting municipalities into ${targetTable}:`, municipalitiesError);
    return new Response(
      JSON.stringify({ error: `Failed to insert municipalities: ${municipalitiesError.message}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ 
      message: `Data populated successfully in ${targetTable}`, 
      provincesCount: provinces.length,
      municipalitiesCount: formattedMunicipalities.length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
