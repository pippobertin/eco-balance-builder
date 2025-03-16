
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
import { corsHeaders } from "./constants.ts";
import { handleCustomData } from "./customDataHandler.ts";
import { handleProvinceData } from "./provinceHandler.ts";
import { populateData } from "./dataPopulator.ts";
import { RequestData } from "./types.ts";

/**
 * Main handler for the populate-italian-locations edge function
 * Processes requests to populate province and municipality data
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { 
        global: { 
          headers: { Authorization: req.headers.get('Authorization')! } 
        } 
      }
    );

    // Parse request body
    let requestData: RequestData = {};
    if (req.method === 'POST') {
      try {
        requestData = await req.json();
        console.log("Received request data:", JSON.stringify(requestData).substring(0, 200) + "...");
      } catch (error) {
        console.error("Error parsing request JSON:", error);
      }
    }

    // Determine target table - default to 'municipalities'
    const targetTable = requestData?.targetTable || 'municipalities';
    console.log(`Using target table: ${targetTable}`);

    // Check if we're uploading custom municipality data
    if (requestData?.customData?.municipalities) {
      return await handleCustomData(supabaseClient, requestData);
    }

    // Get the specific province code from the request, if any
    const provinceCode = requestData?.province;
    if (provinceCode) {
      return await handleProvinceData(supabaseClient, provinceCode, targetTable);
    }

    // If no specific handler is triggered, populate all data
    return await populateData(supabaseClient, targetTable);
    
  } catch (error) {
    console.error(`Error in populate-italian-locations function:`, error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
