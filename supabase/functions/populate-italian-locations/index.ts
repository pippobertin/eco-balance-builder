
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting populate-italian-locations function...");
    
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Check if the tables already have data
    const { count: provincesCount, error: provincesError } = await supabaseClient
      .from('provinces')
      .select('*', { count: 'exact', head: true });

    if (provincesError) {
      console.error("Error checking provinces:", provincesError);
      throw provincesError;
    }

    console.log(`Found ${provincesCount} provinces`);

    // Also check municipalities
    const { count: municipalitiesCount, error: municipalitiesCountError } = await supabaseClient
      .from('municipalities')
      .select('*', { count: 'exact', head: true });

    if (municipalitiesCountError) {
      console.error("Error checking municipalities:", municipalitiesCountError);
      throw municipalitiesCountError;
    }

    console.log(`Found ${municipalitiesCount} municipalities`);

    // Only skip if both tables have data
    if (provincesCount && provincesCount > 0 && municipalitiesCount && municipalitiesCount > 0) {
      console.log("Data already exists in both tables. Operation skipped.");
      return new Response(
        JSON.stringify({ 
          message: "Data already exists in the database. Operation skipped.",
          provinces_count: provincesCount,
          municipalities_count: municipalitiesCount
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    console.log("Starting data import...");

    // Perform data import for provinces if needed
    if (!provincesCount || provincesCount === 0) {
      const provinces = [
        { code: "AG", name: "Agrigento" },
        { code: "AL", name: "Alessandria" },
        { code: "AN", name: "Ancona" },
        { code: "AO", name: "Aosta" },
        { code: "AP", name: "Ascoli Piceno" },
        { code: "AQ", name: "L'Aquila" },
        { code: "AR", name: "Arezzo" },
        { code: "AT", name: "Asti" },
        { code: "AV", name: "Avellino" },
        { code: "BA", name: "Bari" },
        { code: "BG", name: "Bergamo" },
        { code: "BI", name: "Biella" },
        { code: "BL", name: "Belluno" },
        { code: "BN", name: "Benevento" },
        { code: "BO", name: "Bologna" },
        { code: "BR", name: "Brindisi" },
        { code: "BS", name: "Brescia" },
        { code: "BT", name: "Barletta-Andria-Trani" },
        { code: "CA", name: "Cagliari" },
        { code: "CB", name: "Campobasso" },
        { code: "CE", name: "Caserta" },
        { code: "CH", name: "Chieti" },
        { code: "CL", name: "Caltanissetta" },
        { code: "CN", name: "Cuneo" },
        { code: "CO", name: "Como" },
        { code: "CR", name: "Cremona" },
        { code: "CS", name: "Cosenza" },
        { code: "CT", name: "Catania" },
        { code: "CZ", name: "Catanzaro" },
        { code: "EN", name: "Enna" },
        { code: "FC", name: "Forlì-Cesena" },
        { code: "FE", name: "Ferrara" },
        { code: "FG", name: "Foggia" },
        { code: "FI", name: "Firenze" },
        { code: "FM", name: "Fermo" },
        { code: "FR", name: "Frosinone" },
        { code: "GE", name: "Genova" },
        { code: "GO", name: "Gorizia" },
        { code: "GR", name: "Grosseto" },
        { code: "IM", name: "Imperia" },
        { code: "IS", name: "Isernia" },
        { code: "KR", name: "Crotone" },
        { code: "LC", name: "Lecco" },
        { code: "LE", name: "Lecce" },
        { code: "LI", name: "Livorno" },
        { code: "LO", name: "Lodi" },
        { code: "LT", name: "Latina" },
        { code: "LU", name: "Lucca" },
        { code: "MB", name: "Monza e Brianza" },
        { code: "MC", name: "Macerata" },
        { code: "ME", name: "Messina" },
        { code: "MI", name: "Milano" },
        { code: "MN", name: "Mantova" },
        { code: "MO", name: "Modena" },
        { code: "MS", name: "Massa-Carrara" },
        { code: "MT", name: "Matera" },
        { code: "NA", name: "Napoli" },
        { code: "NO", name: "Novara" },
        { code: "NU", name: "Nuoro" },
        { code: "OR", name: "Oristano" },
        { code: "PA", name: "Palermo" },
        { code: "PC", name: "Piacenza" },
        { code: "PD", name: "Padova" },
        { code: "PE", name: "Pescara" },
        { code: "PG", name: "Perugia" },
        { code: "PI", name: "Pisa" },
        { code: "PN", name: "Pordenone" },
        { code: "PO", name: "Prato" },
        { code: "PR", name: "Parma" },
        { code: "PT", name: "Pistoia" },
        { code: "PU", name: "Pesaro e Urbino" },
        { code: "PV", name: "Pavia" },
        { code: "PZ", name: "Potenza" },
        { code: "RA", name: "Ravenna" },
        { code: "RC", name: "Reggio Calabria" },
        { code: "RE", name: "Reggio Emilia" },
        { code: "RG", name: "Ragusa" },
        { code: "RI", name: "Rieti" },
        { code: "RM", name: "Roma" },
        { code: "RN", name: "Rimini" },
        { code: "RO", name: "Rovigo" },
        { code: "SA", name: "Salerno" },
        { code: "SI", name: "Siena" },
        { code: "SO", name: "Sondrio" },
        { code: "SP", name: "La Spezia" },
        { code: "SR", name: "Siracusa" },
        { code: "SS", name: "Sassari" },
        { code: "SU", name: "Sud Sardegna" },
        { code: "SV", name: "Savona" },
        { code: "TA", name: "Taranto" },
        { code: "TE", name: "Teramo" },
        { code: "TN", name: "Trento" },
        { code: "TO", name: "Torino" },
        { code: "TP", name: "Trapani" },
        { code: "TR", name: "Terni" },
        { code: "TS", name: "Trieste" },
        { code: "TV", name: "Treviso" },
        { code: "UD", name: "Udine" },
        { code: "VA", name: "Varese" },
        { code: "VB", name: "Verbano-Cusio-Ossola" },
        { code: "VC", name: "Vercelli" },
        { code: "VE", name: "Venezia" },
        { code: "VI", name: "Vicenza" },
        { code: "VR", name: "Verona" },
        { code: "VT", name: "Viterbo" },
        { code: "VV", name: "Vibo Valentia" }
      ];

      // Insert provinces
      const { error: insertProvincesError } = await supabaseClient
        .from('provinces')
        .insert(provinces);

      if (insertProvincesError) {
        console.error("Error inserting provinces:", insertProvincesError);
        throw insertProvincesError;
      }

      console.log("Provinces inserted successfully:", provinces.length);
    }

    // Add municipalities if needed
    if (!municipalitiesCount || municipalitiesCount === 0) {
      const municipalities = [
        // Milano province
        { name: "Milano", province_code: "MI", postal_codes: ["20121", "20122", "20123", "20124", "20125"] },
        { name: "Sesto San Giovanni", province_code: "MI", postal_codes: ["20099"] },
        { name: "Cinisello Balsamo", province_code: "MI", postal_codes: ["20092"] },
        { name: "Legnano", province_code: "MI", postal_codes: ["20025"] },
        { name: "Rho", province_code: "MI", postal_codes: ["20017"] },
        
        // Roma province
        { name: "Roma", province_code: "RM", postal_codes: ["00118", "00119", "00120", "00121", "00122", "00123", "00124", "00125", "00126", "00127", "00128", "00129", "00130", "00131", "00132", "00133", "00134", "00135", "00136", "00137", "00138", "00139", "00140", "00141", "00142", "00143", "00144", "00145", "00146", "00147", "00148", "00149", "00150", "00151", "00152", "00153", "00154", "00155", "00156", "00157", "00158", "00159", "00160", "00161", "00162", "00163", "00164", "00165", "00166", "00167", "00168", "00169", "00170", "00171", "00172", "00173", "00174", "00175", "00176", "00177", "00178", "00179", "00181", "00182", "00183", "00184", "00185", "00186", "00187", "00188", "00189", "00190", "00191", "00192", "00193", "00194", "00195", "00196", "00197", "00198", "00199"] },
        { name: "Fiumicino", province_code: "RM", postal_codes: ["00054"] },
        { name: "Civitavecchia", province_code: "RM", postal_codes: ["00053"] },
        { name: "Tivoli", province_code: "RM", postal_codes: ["00019"] },
        { name: "Pomezia", province_code: "RM", postal_codes: ["00040"] },
        
        // Torino province
        { name: "Torino", province_code: "TO", postal_codes: ["10121", "10122", "10123", "10124", "10125", "10126", "10127", "10128", "10129", "10130", "10131", "10132", "10133", "10134", "10135", "10136", "10137", "10138", "10139", "10140", "10141", "10142", "10143", "10144", "10145", "10146", "10147", "10148", "10149", "10150", "10151", "10152", "10153", "10154", "10155", "10156"] },
        { name: "Moncalieri", province_code: "TO", postal_codes: ["10024"] },
        { name: "Rivoli", province_code: "TO", postal_codes: ["10098"] },
        { name: "Pinerolo", province_code: "TO", postal_codes: ["10064"] },
        { name: "Chieri", province_code: "TO", postal_codes: ["10023"] },
        
        // Napoli province
        { name: "Napoli", province_code: "NA", postal_codes: ["80121", "80122", "80123", "80124", "80125", "80126", "80127", "80128", "80129", "80130", "80131", "80132", "80133", "80134", "80135", "80136", "80137", "80138", "80139", "80140", "80141", "80142", "80143", "80144", "80145", "80146", "80147"] },
        { name: "Pozzuoli", province_code: "NA", postal_codes: ["80078"] },
        { name: "Portici", province_code: "NA", postal_codes: ["80055"] },
        { name: "Casoria", province_code: "NA", postal_codes: ["80026"] },
        { name: "Castellammare di Stabia", province_code: "NA", postal_codes: ["80053"] },
        
        // Bologna province
        { name: "Bologna", province_code: "BO", postal_codes: ["40121", "40122", "40123", "40124", "40125", "40126", "40127", "40128", "40129", "40130", "40131", "40132", "40133", "40134", "40135", "40136", "40137", "40138", "40139"] },
        { name: "Imola", province_code: "BO", postal_codes: ["40026"] },
        { name: "San Lazzaro di Savena", province_code: "BO", postal_codes: ["40068"] },
        { name: "Casalecchio di Reno", province_code: "BO", postal_codes: ["40033"] },
        { name: "Budrio", province_code: "BO", postal_codes: ["40054"] }
      ];

      // Insert municipalities
      const { error: insertMunicipalitiesError } = await supabaseClient
        .from('municipalities')
        .insert(municipalities);

      if (insertMunicipalitiesError) {
        console.error("Error inserting municipalities:", insertMunicipalitiesError);
        throw insertMunicipalitiesError;
      }

      console.log("Municipalities inserted successfully:", municipalities.length);
    }

    // Verify data was inserted correctly by checking counts again
    const { count: finalProvincesCount, error: finalProvincesError } = await supabaseClient
      .from('provinces')
      .select('*', { count: 'exact', head: true });

    const { count: finalMunicipalitiesCount, error: finalMunicipalitiesError } = await supabaseClient
      .from('municipalities')
      .select('*', { count: 'exact', head: true });

    if (finalProvincesError || finalMunicipalitiesError) {
      console.error("Error checking final counts:", finalProvincesError || finalMunicipalitiesError);
    } else {
      console.log(`Final counts - Provinces: ${finalProvincesCount}, Municipalities: ${finalMunicipalitiesCount}`);
    }

    return new Response(
      JSON.stringify({ 
        message: "Italian locations data imported successfully",
        provinces_count: finalProvincesCount || 0,
        municipalities_count: finalMunicipalitiesCount || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
