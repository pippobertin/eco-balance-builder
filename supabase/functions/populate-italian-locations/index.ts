
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
import { corsHeaders } from "./constants.ts";
import { handleCustomData } from "./customDataHandler.ts";
import { handleProvinceData } from "./provinceHandler.ts";
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
    
    // Handle request by type
    if (requestData.customData) {
      // Handle custom data upload
      return await handleCustomData(client, requestData);
    } else if (requestData.province) {
      // Handle province-specific data
      return await handleProvinceData(client, requestData);
    } else {
      // Handle general data population (not implemented in this example)
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
