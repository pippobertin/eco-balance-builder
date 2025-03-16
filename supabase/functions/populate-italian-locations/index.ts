
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
import { corsHeaders } from "./constants.ts";

// Sample Italian municipalities data for demo purposes - will be replaced with real data
const sampleMunicipalities = {
  "AL": [
    { name: "Alessandria", province_code: "AL", postal_codes: ["15121", "15122"] },
    { name: "Acqui Terme", province_code: "AL", postal_codes: ["15011"] },
    { name: "Casale Monferrato", province_code: "AL", postal_codes: ["15033"] },
    { name: "Novi Ligure", province_code: "AL", postal_codes: ["15067"] },
    { name: "Tortona", province_code: "AL", postal_codes: ["15057"] },
    { name: "Valenza", province_code: "AL", postal_codes: ["15048"] }
  ],
  "MI": [
    { name: "Milano", province_code: "MI", postal_codes: ["20121", "20122", "20123", "20124", "20125", "20126", "20127", "20128", "20129", "20130", "20131", "20132", "20133", "20134", "20135", "20136", "20137", "20138", "20139", "20140", "20141", "20142", "20143", "20144", "20145", "20146", "20147", "20148", "20149", "20150", "20151", "20152", "20153", "20154", "20155", "20156", "20157", "20158", "20159", "20160", "20161", "20162"] },
    { name: "Abbiategrasso", province_code: "MI", postal_codes: ["20081"] },
    { name: "Legnano", province_code: "MI", postal_codes: ["20025"] },
    { name: "Rho", province_code: "MI", postal_codes: ["20017"] }
  ],
  "RM": [
    { name: "Roma", province_code: "RM", postal_codes: ["00118", "00121", "00122", "00123", "00124", "00125", "00126", "00127", "00128", "00131", "00132", "00133", "00134", "00135", "00136", "00137", "00138", "00139", "00141", "00142", "00143", "00144", "00145", "00146", "00147", "00148", "00149", "00151", "00152", "00153", "00154", "00155", "00156", "00157", "00158", "00159", "00161", "00162", "00163", "00164", "00165", "00166", "00167", "00168", "00169", "00171", "00172", "00173", "00174", "00175", "00176", "00177", "00178", "00179", "00181", "00182", "00183", "00184", "00185", "00186", "00187", "00188", "00189", "00191", "00192", "00193", "00194", "00195", "00196", "00197", "00198", "00199"] },
    { name: "Fiumicino", province_code: "RM", postal_codes: ["00054"] },
    { name: "Civitavecchia", province_code: "RM", postal_codes: ["00053"] }
  ]
};

serve(async (req) => {
  console.log("Processing request:", req.method, req.url);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  try {
    // Get the request body
    const requestData = await req.json();
    console.log("Received request data:", JSON.stringify(requestData));
    
    // Create Supabase client using auth token from request
    const client = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") ?? "" },
        },
      }
    );
    
    // Determine the target table
    const targetTable = requestData.targetTable || 'municipalities';
    console.log(`Using target table: ${targetTable}`);
    
    // Handle province-specific data request
    if (requestData.province) {
      const province = requestData.province;
      
      // Check if the province exists
      const { data: provinceData, error: provinceError } = await client
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
      
      // Insert sample municipalities for the province
      if (sampleMunicipalities[province]) {
        console.log(`Upserting ${sampleMunicipalities[province].length} municipalities for province ${province}`);
        
        // Clear existing municipalities for this province if specified
        if (requestData.clearExisting) {
          const { error: deleteError } = await client
            .from(targetTable)
            .delete()
            .eq('province_code', province);
            
          if (deleteError) {
            console.error(`Error clearing municipalities for province ${province}:`, deleteError);
          }
        }
        
        // Insert municipalities
        const { error: insertError } = await client
          .from(targetTable)
          .upsert(
            sampleMunicipalities[province].map(mun => ({
              name: mun.name,
              province_code: mun.province_code,
              postal_codes: mun.postal_codes
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
            message: `Successfully populated municipalities for ${provinceData.name} (${province})`,
            count: sampleMunicipalities[province].length
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        // Return success even if no sample data for this province
        return new Response(
          JSON.stringify({ 
            message: `No sample data available for province ${provinceData.name} (${province})`,
            count: 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } 
    // Handle custom data upload
    else if (requestData.customData?.municipalities?.length) {
      // Check if we should clear existing data
      if (requestData.clearExisting) {
        console.log(`Clearing existing data from ${targetTable}`);
        const { error: deleteError } = await client
          .from(targetTable)
          .delete()
          .neq('id', 0);  // Dummy condition to delete all
          
        if (deleteError) {
          console.error(`Error clearing ${targetTable}:`, deleteError);
          return new Response(
            JSON.stringify({ error: `Failed to clear existing data: ${deleteError.message}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      // Format and insert the municipalities
      const municipalities = requestData.customData.municipalities.map(mun => ({
        name: mun.name || mun.denominazione_ita,
        province_code: mun.province_code || mun.sigla_provincia,
        postal_codes: Array.isArray(mun.postal_codes) 
          ? mun.postal_codes
          : typeof mun.postal_codes === 'string'
            ? [mun.postal_codes]
            : mun.cap 
              ? [mun.cap] 
              : []
      }));
      
      console.log(`Inserting ${municipalities.length} municipalities`);
      
      const { error: insertError } = await client
        .from(targetTable)
        .insert(municipalities);
        
      if (insertError) {
        console.error(`Error inserting data into ${targetTable}:`, insertError);
        return new Response(
          JSON.stringify({ error: `Failed to insert data: ${insertError.message}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          message: `Custom data uploaded successfully to ${targetTable}`, 
          count: municipalities.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // When no specific province or custom data is provided, populate sample data for common provinces
      console.log("No specific province or custom data provided, populating sample data");
      
      // Flatten all sample municipalities into one array
      const allMunicipalities = [];
      for (const province in sampleMunicipalities) {
        allMunicipalities.push(...sampleMunicipalities[province]);
      }
      
      // Clear existing data if requested
      if (requestData.clearExisting) {
        const { error: deleteError } = await client
          .from(targetTable)
          .delete()
          .neq('id', 0);
          
        if (deleteError) {
          console.error(`Error clearing ${targetTable}:`, deleteError);
        }
      }
      
      // Insert all municipalities
      const { error: insertError } = await client
        .from(targetTable)
        .upsert(
          allMunicipalities.map(mun => ({
            name: mun.name,
            province_code: mun.province_code,
            postal_codes: mun.postal_codes
          }))
        );
      
      if (insertError) {
        console.error(`Error inserting municipalities:`, insertError);
        return new Response(
          JSON.stringify({ error: `Failed to insert municipalities: ${insertError.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          message: `Successfully populated sample municipalities for common provinces`,
          count: allMunicipalities.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
