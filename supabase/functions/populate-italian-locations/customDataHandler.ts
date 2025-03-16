
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
import { corsHeaders } from "./constants.ts";
import { RequestData } from "./types.ts";

/**
 * Handles uploading custom municipality data
 * @param supabaseClient Supabase client instance
 * @param requestData Request data containing custom municipality information
 * @returns Response with operation result
 */
export async function handleCustomData(
  supabaseClient: ReturnType<typeof createClient>,
  requestData: RequestData
): Promise<Response> {
  console.log("Handling custom data upload");
  
  const targetTable = requestData.targetTable || 'municipalities';
  
  // Check if we should clear existing data
  if (requestData.clearExisting) {
    console.log(`Clearing existing data from ${targetTable}`);
    const { error: deleteError } = await supabaseClient
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

  // Insert custom municipality data
  const { error: insertError } = await supabaseClient
    .from(targetTable)
    .insert(requestData.customData?.municipalities || []);
    
  if (insertError) {
    console.error(`Error inserting custom data into ${targetTable}:`, insertError);
    return new Response(
      JSON.stringify({ error: `Failed to insert custom data: ${insertError.message}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ 
      message: `Custom data uploaded successfully to ${targetTable}`, 
      count: (requestData.customData?.municipalities || []).length 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
