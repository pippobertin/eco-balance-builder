
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
import { corsHeaders } from "./constants.ts";
import { defaultMunicipalities } from "./constants.ts";
import { Municipality } from "./types.ts";

/**
 * Handles populating municipalities for a specific province
 * @param supabaseClient Supabase client instance
 * @param provinceCode Province code to populate municipalities for
 * @param targetTable Target table for storing municipalities
 * @returns Response with operation result
 */
export async function handleProvinceData(
  supabaseClient: ReturnType<typeof createClient>, 
  provinceCode: string,
  targetTable: string
): Promise<Response> {
  console.log(`Received request to populate municipalities for province: ${provinceCode}`);

  // Check if municipalities for this province already exist
  const { count, error: countError } = await supabaseClient
    .from(targetTable)
    .select('*', { count: 'exact', head: true })
    .eq('province_code', provinceCode);
  
  if (countError) {
    console.error(`Error checking municipalities for province ${provinceCode}:`, countError);
    return new Response(
      JSON.stringify({ error: `Failed to check existing municipalities: ${countError.message}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (count && count > 0) {
    return new Response(
      JSON.stringify({ 
        message: `Municipalities for province ${provinceCode} already populated in ${targetTable}`, 
        count 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Filter municipalities for this province
  const provinceMunicipalities = defaultMunicipalities.filter(m => m.province_code === provinceCode);
  
  if (provinceMunicipalities.length === 0) {
    console.log(`No predefined municipalities found for province ${provinceCode}`);
    
    // If we don't have predefined municipalities for this province, add some default entries
    let defaultMunicipalitiesForProvince;
    if (targetTable === 'mun') {
      defaultMunicipalitiesForProvince = [
        { 
          name: `Capoluogo di ${provinceCode}`, 
          province_code: provinceCode, 
          postal_codes: "00000" 
        },
        { 
          name: `Comune di ${provinceCode}`, 
          province_code: provinceCode, 
          postal_codes: "00001" 
        }
      ];
    } else {
      defaultMunicipalitiesForProvince = [
        { 
          name: `Capoluogo di ${provinceCode}`, 
          province_code: provinceCode, 
          postal_codes: ["00000"] 
        },
        { 
          name: `Comune di ${provinceCode}`, 
          province_code: provinceCode, 
          postal_codes: ["00001"] 
        }
      ];
    }
    
    // Insert default municipalities
    const { error: municipalitiesError } = await supabaseClient
      .from(targetTable)
      .insert(defaultMunicipalitiesForProvince);

    if (municipalitiesError) {
      console.error(`Error inserting default municipalities for province ${provinceCode}:`, municipalitiesError);
      return new Response(
        JSON.stringify({ error: `Failed to insert default municipalities: ${municipalitiesError.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: `Added default municipalities for province ${provinceCode} to ${targetTable}`, 
        count: defaultMunicipalitiesForProvince.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Format municipalities for the target table
  let formattedMunicipalities;
  if (targetTable === 'mun') {
    formattedMunicipalities = provinceMunicipalities;
  } else {
    // Convert string postal_codes to arrays for 'municipalities' table
    formattedMunicipalities = provinceMunicipalities.map(m => ({
      name: m.name,
      province_code: m.province_code,
      postal_codes: typeof m.postal_codes === 'string' ? m.postal_codes.split(',') : m.postal_codes
    }));
  }

  // Insert province municipalities
  const { error: municipalitiesError } = await supabaseClient
    .from(targetTable)
    .insert(formattedMunicipalities);

  if (municipalitiesError) {
    console.error(`Error inserting municipalities for province ${provinceCode}:`, municipalitiesError);
    return new Response(
      JSON.stringify({ error: `Failed to insert municipalities: ${municipalitiesError.message}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ 
      message: `Municipalities for province ${provinceCode} populated successfully in ${targetTable}`, 
      count: formattedMunicipalities.length 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
