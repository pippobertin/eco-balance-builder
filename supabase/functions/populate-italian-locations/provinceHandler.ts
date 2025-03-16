
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
import { corsHeaders } from "./constants.ts";
import { RequestData, Municipality } from "./types.ts";

/**
 * Handle request to populate municipalities for a specific province
 * @param supabaseClient Supabase client instance
 * @param requestData Request data containing province code
 * @returns Response with operation result
 */
export async function handleProvinceData(
  supabaseClient: ReturnType<typeof createClient>,
  requestData: RequestData
): Promise<Response> {
  const province = requestData.province;
  if (!province) {
    return new Response(
      JSON.stringify({ error: "Province code is required" }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log(`Processing data for province: ${province}`);
  
  // Check if the province exists
  const { data: provinceData, error: provinceError } = await supabaseClient
    .from('provinces')
    .select('*')
    .eq('code', province)
    .single();
  
  if (provinceError) {
    console.error("Error fetching province:", provinceError);
    return new Response(
      JSON.stringify({ error: `Province with code ${province} not found` }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  console.log(`Province found: ${provinceData.name}`);
  
  // Insert municipalities for the province
  const targetTable = requestData.targetTable || 'municipalities';
  
  // Process municipalities
  const municipalities: Municipality[] = [
    // Sample municipalities - these would be replaced by actual data
    {
      name: "Sample City",
      province_code: province,
      postal_codes: ["12345"]
    }
  ];
  
  console.log(`Upserting ${municipalities.length} municipalities for province ${province} into ${targetTable}`);
  
  const { error: insertError } = await supabaseClient
    .from(targetTable)
    .upsert(
      municipalities.map(mun => ({
        name: mun.name,
        province_code: mun.province_code,
        postal_codes: Array.isArray(mun.postal_codes) 
          ? mun.postal_codes.join(',') 
          : mun.postal_codes
      }))
    );
  
  if (insertError) {
    console.error("Error inserting municipalities:", insertError);
    return new Response(
      JSON.stringify({ error: `Failed to insert municipalities: ${insertError.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  return new Response(
    JSON.stringify({ 
      message: `Successfully processed province ${provinceData.name} (${province})`,
      count: municipalities.length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
