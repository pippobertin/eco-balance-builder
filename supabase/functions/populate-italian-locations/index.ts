
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
import { corsHeaders } from "./constants.ts";
import { RequestData } from "./types.ts";

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
    const requestData: RequestData = await req.json();
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
    
    // Handle custom data upload
    if (requestData.customData?.municipalities?.length) {
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
          ? mun.postal_codes.join(',') 
          : mun.postal_codes || mun.cap || ""
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
    } 
    // Handle province-specific data request
    else if (requestData.province) {
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
      
      // For now, we'll return success as we're not implementing the actual data population
      // In a real implementation, you would fetch and upload real municipality data
      return new Response(
        JSON.stringify({ 
          message: `Successfully processed province ${provinceData.name} (${province})`,
          count: 0  // Replace with actual count when implementing
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Handle general case (no specific province or custom data)
      return new Response(
        JSON.stringify({ 
          error: "Unsupported operation. Specify either 'customData' or 'province' in your request." 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
