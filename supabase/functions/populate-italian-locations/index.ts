import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Province {
  code: string;
  name: string;
}

interface Municipality {
  name: string;
  province_code: string;
  postal_codes: string[];
}

const provinces: Province[] = [
  { code: "AG", name: "Agrigento" },
  { code: "AL", name: "Alessandria" },
  { code: "AN", name: "Ancona" },
  { code: "AO", name: "Aosta" },
  { code: "AR", name: "Arezzo" },
  { code: "AP", name: "Ascoli Piceno" },
  { code: "AT", name: "Asti" },
  { code: "AV", name: "Avellino" },
  { code: "BA", name: "Bari" },
  { code: "BT", name: "Barletta-Andria-Trani" },
  { code: "BL", name: "Belluno" },
  { code: "BN", name: "Benevento" },
  { code: "BG", name: "Bergamo" },
  { code: "BI", name: "Biella" },
  { code: "BO", name: "Bologna" },
  { code: "BZ", name: "Bolzano" },
  { code: "BS", name: "Brescia" },
  { code: "BR", name: "Brindisi" },
  { code: "CA", name: "Cagliari" },
  { code: "CL", name: "Caltanissetta" },
  { code: "CB", name: "Campobasso" },
  { code: "CE", name: "Caserta" },
  { code: "CT", name: "Catania" },
  { code: "CZ", name: "Catanzaro" },
  { code: "CH", name: "Chieti" },
  { code: "CO", name: "Como" },
  { code: "CS", name: "Cosenza" },
  { code: "CR", name: "Cremona" },
  { code: "KR", name: "Crotone" },
  { code: "CN", name: "Cuneo" },
  { code: "EN", name: "Enna" },
  { code: "FM", name: "Fermo" },
  { code: "FE", name: "Ferrara" },
  { code: "FI", name: "Firenze" },
  { code: "FG", name: "Foggia" },
  { code: "FC", name: "Forlì-Cesena" },
  { code: "FR", name: "Frosinone" },
  { code: "GE", name: "Genova" },
  { code: "GO", name: "Gorizia" },
  { code: "GR", name: "Grosseto" },
  { code: "IM", name: "Imperia" },
  { code: "IS", name: "Isernia" },
  { code: "SP", name: "La Spezia" },
  { code: "AQ", name: "L'Aquila" },
  { code: "LT", name: "Latina" },
  { code: "LE", name: "Lecce" },
  { code: "LC", name: "Lecco" },
  { code: "LI", name: "Livorno" },
  { code: "LO", name: "Lodi" },
  { code: "LU", name: "Lucca" },
  { code: "MC", name: "Macerata" },
  { code: "MN", name: "Mantova" },
  { code: "MS", name: "Massa-Carrara" },
  { code: "MT", name: "Matera" },
  { code: "ME", name: "Messina" },
  { code: "MI", name: "Milano" },
  { code: "MO", name: "Modena" },
  { code: "MB", name: "Monza e della Brianza" },
  { code: "NA", name: "Napoli" },
  { code: "NO", name: "Novara" },
  { code: "NU", name: "Nuoro" },
  { code: "OR", name: "Oristano" },
  { code: "PD", name: "Padova" },
  { code: "PA", name: "Palermo" },
  { code: "PR", name: "Parma" },
  { code: "PV", name: "Pavia" },
  { code: "PG", name: "Perugia" },
  { code: "PU", name: "Pesaro e Urbino" },
  { code: "PE", name: "Pescara" },
  { code: "PC", name: "Piacenza" },
  { code: "PI", name: "Pisa" },
  { code: "PT", name: "Pistoia" },
  { code: "PN", name: "Pordenone" },
  { code: "PZ", name: "Potenza" },
  { code: "PO", name: "Prato" },
  { code: "RG", name: "Ragusa" },
  { code: "RA", name: "Ravenna" },
  { code: "RC", name: "Reggio Calabria" },
  { code: "RE", name: "Reggio Emilia" },
  { code: "RI", name: "Rieti" },
  { code: "RN", name: "Rimini" },
  { code: "RM", name: "Roma" },
  { code: "RO", name: "Rovigo" },
  { code: "SA", name: "Salerno" },
  { code: "SS", name: "Sassari" },
  { code: "SV", name: "Savona" },
  { code: "SI", name: "Siena" },
  { code: "SR", name: "Siracusa" },
  { code: "SO", name: "Sondrio" },
  { code: "SU", name: "Sud Sardegna" },
  { code: "TA", name: "Taranto" },
  { code: "TE", name: "Teramo" },
  { code: "TR", name: "Terni" },
  { code: "TO", name: "Torino" },
  { code: "TP", name: "Trapani" },
  { code: "TN", name: "Trento" },
  { code: "TV", name: "Treviso" },
  { code: "TS", name: "Trieste" },
  { code: "UD", name: "Udine" },
  { code: "VA", name: "Varese" },
  { code: "VE", name: "Venezia" },
  { code: "VB", name: "Verbano-Cusio-Ossola" },
  { code: "VC", name: "Vercelli" },
  { code: "VR", name: "Verona" },
  { code: "VV", name: "Vibo Valentia" },
  { code: "VI", name: "Vicenza" },
  { code: "VT", name: "Viterbo" }
];

// Extended list of municipalities for most common provinces
const municipalities: Municipality[] = [
  // Roma (RM) municipalities
  { name: "Roma", province_code: "RM", postal_codes: ["00100", "00118", "00121", "00122", "00123", "00124", "00125", "00126", "00127", "00128", "00131", "00133", "00135", "00136", "00137", "00138", "00139", "00141", "00142", "00143", "00144", "00145", "00146", "00147", "00148", "00149", "00151", "00152", "00153", "00154", "00155", "00156", "00159", "00161", "00162", "00164", "00165", "00167", "00168", "00169", "00171", "00172", "00173", "00174", "00175", "00176", "00177", "00178", "00179", "00181", "00182", "00183", "00184", "00185", "00186", "00187", "00188", "00189", "00191", "00192", "00193", "00195", "00196", "00197", "00198", "00199"] },
  { name: "Fiumicino", province_code: "RM", postal_codes: ["00054", "00050", "00057"] },
  { name: "Ciampino", province_code: "RM", postal_codes: ["00043"] },
  { name: "Tivoli", province_code: "RM", postal_codes: ["00019"] },
  { name: "Guidonia Montecelio", province_code: "RM", postal_codes: ["00012"] },
  
  // Milano (MI) municipalities
  { name: "Milano", province_code: "MI", postal_codes: ["20121", "20122", "20123", "20124", "20125", "20126", "20127", "20128", "20129", "20131", "20132", "20133", "20134", "20135", "20136", "20137", "20138", "20139", "20141", "20142", "20143", "20144", "20145", "20146", "20147", "20148", "20149", "20151", "20152", "20153", "20154", "20155", "20156", "20157", "20158", "20159", "20161", "20162"] },
  { name: "Segrate", province_code: "MI", postal_codes: ["20090"] },
  { name: "Corsico", province_code: "MI", postal_codes: ["20094"] },
  { name: "Sesto San Giovanni", province_code: "MI", postal_codes: ["20099"] },
  { name: "Cinisello Balsamo", province_code: "MI", postal_codes: ["20092"] },
  
  // Napoli (NA) municipalities
  { name: "Napoli", province_code: "NA", postal_codes: ["80100", "80121", "80122", "80123", "80124", "80125", "80126", "80127", "80128", "80129", "80131", "80132", "80133", "80134", "80135", "80136", "80137", "80138", "80139", "80141", "80142", "80143", "80144", "80145", "80146", "80147"] },
  { name: "Pozzuoli", province_code: "NA", postal_codes: ["80078"] },
  { name: "Portici", province_code: "NA", postal_codes: ["80055"] },
  { name: "Casoria", province_code: "NA", postal_codes: ["80026"] },
  { name: "Torre del Greco", province_code: "NA", postal_codes: ["80059"] },
  
  // Torino (TO) municipalities
  { name: "Torino", province_code: "TO", postal_codes: ["10121", "10122", "10123", "10124", "10125", "10126", "10127", "10128", "10129", "10131", "10132", "10133", "10134", "10135", "10136", "10137", "10138", "10139", "10141", "10142", "10143", "10144", "10145", "10146", "10147", "10148", "10149", "10151", "10152", "10153", "10154", "10155", "10156"] },
  { name: "Moncalieri", province_code: "TO", postal_codes: ["10024"] },
  { name: "Rivoli", province_code: "TO", postal_codes: ["10098"] },
  { name: "Collegno", province_code: "TO", postal_codes: ["10093"] },
  { name: "Nichelino", province_code: "TO", postal_codes: ["10042"] },
  
  // Bologna (BO) municipalities
  { name: "Bologna", province_code: "BO", postal_codes: ["40121", "40122", "40123", "40124", "40125", "40126", "40127", "40128", "40129", "40131", "40132", "40133", "40134", "40135", "40136", "40137", "40138", "40139"] },
  { name: "Casalecchio di Reno", province_code: "BO", postal_codes: ["40033"] },
  { name: "San Lazzaro di Savena", province_code: "BO", postal_codes: ["40068"] },
  { name: "Imola", province_code: "BO", postal_codes: ["40026"] },
  { name: "Castel Maggiore", province_code: "BO", postal_codes: ["40013"] },
  
  // Firenze (FI) municipalities
  { name: "Firenze", province_code: "FI", postal_codes: ["50121", "50122", "50123", "50124", "50125", "50126", "50127", "50128", "50129", "50131", "50132", "50133", "50134", "50135", "50136", "50137", "50138", "50139", "50141", "50142", "50143", "50144", "50145"] },
  { name: "Sesto Fiorentino", province_code: "FI", postal_codes: ["50019"] },
  { name: "Scandicci", province_code: "FI", postal_codes: ["50018"] },
  { name: "Empoli", province_code: "FI", postal_codes: ["50053"] },
  { name: "Campi Bisenzio", province_code: "FI", postal_codes: ["50013"] },
  
  // Bari (BA) municipalities
  { name: "Bari", province_code: "BA", postal_codes: ["70121", "70122", "70123", "70124", "70125", "70126", "70127", "70128", "70129", "70131", "70132"] },
  { name: "Modugno", province_code: "BA", postal_codes: ["70026"] },
  { name: "Altamura", province_code: "BA", postal_codes: ["70022"] },
  { name: "Monopoli", province_code: "BA", postal_codes: ["70043"] },
  { name: "Bitonto", province_code: "BA", postal_codes: ["70032"] },
  
  // Verona (VR) municipalities
  { name: "Verona", province_code: "VR", postal_codes: ["37121", "37122", "37123", "37124", "37125", "37126", "37127", "37128", "37129", "37131", "37132", "37133", "37134", "37135", "37136", "37137", "37138", "37139", "37141", "37142"] },
  { name: "Villafranca di Verona", province_code: "VR", postal_codes: ["37069"] },
  { name: "San Giovanni Lupatoto", province_code: "VR", postal_codes: ["37057"] },
  { name: "Legnago", province_code: "VR", postal_codes: ["37045"] },
  { name: "Bussolengo", province_code: "VR", postal_codes: ["37012"] },
  
  // Venezia (VE) municipalities
  { name: "Venezia", province_code: "VE", postal_codes: ["30121", "30122", "30123", "30124", "30125", "30126", "30127", "30128", "30129", "30131", "30132", "30133", "30134", "30135", "30136", "30137", "30138", "30139", "30141", "30142"] },
  { name: "Mestre", province_code: "VE", postal_codes: ["30171", "30172", "30173", "30174", "30175"] },
  { name: "Chioggia", province_code: "VE", postal_codes: ["30015"] },
  { name: "San Donà di Piave", province_code: "VE", postal_codes: ["30027"] },
  { name: "Portogruaro", province_code: "VE", postal_codes: ["30026"] },
  
  // Genova (GE) municipalities
  { name: "Genova", province_code: "GE", postal_codes: ["16121", "16122", "16123", "16124", "16125", "16126", "16127", "16128", "16129", "16131", "16132", "16133", "16134", "16135", "16136", "16137", "16138", "16139", "16141", "16142", "16143", "16144", "16145", "16146", "16147", "16148", "16149"] },
  { name: "Rapallo", province_code: "GE", postal_codes: ["16035"] },
  { name: "Chiavari", province_code: "GE", postal_codes: ["16043"] },
  { name: "Sestri Levante", province_code: "GE", postal_codes: ["16039"] },
  { name: "Lavagna", province_code: "GE", postal_codes: ["16033"] },
  
  // Palermo (PA) municipalities
  { name: "Palermo", province_code: "PA", postal_codes: ["90121", "90122", "90123", "90124", "90125", "90126", "90127", "90128", "90129", "90131", "90132", "90133", "90134", "90135", "90136", "90137", "90138", "90139", "90141", "90142", "90143", "90144", "90145", "90146", "90147"] },
  { name: "Bagheria", province_code: "PA", postal_codes: ["90011"] },
  { name: "Monreale", province_code: "PA", postal_codes: ["90046"] },
  { name: "Carini", province_code: "PA", postal_codes: ["90044"] },
  { name: "Termini Imerese", province_code: "PA", postal_codes: ["90018"] },
  
  // Ancona (AN) municipalities
  { name: "Ancona", province_code: "AN", postal_codes: ["60121", "60122", "60123", "60124", "60125", "60126", "60127", "60128", "60129", "60131"] },
  { name: "Senigallia", province_code: "AN", postal_codes: ["60019"] },
  { name: "Jesi", province_code: "AN", postal_codes: ["60035"] },
  { name: "Fabriano", province_code: "AN", postal_codes: ["60044"] },
  { name: "Osimo", province_code: "AN", postal_codes: ["60027"] },
  { name: "Montemarciano", province_code: "AN", postal_codes: ["60018"] },
  
  // Aosta (AO) municipalities
  { name: "Aosta", province_code: "AO", postal_codes: ["11100"] },
  { name: "Saint-Vincent", province_code: "AO", postal_codes: ["11027"] },
  { name: "Courmayeur", province_code: "AO", postal_codes: ["11013"] },
  { name: "Châtillon", province_code: "AO", postal_codes: ["11024"] },
  { name: "Gressoney-Saint-Jean", province_code: "AO", postal_codes: ["11025"] }
];

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
    let requestData = {};
    if (req.method === 'POST') {
      try {
        requestData = await req.json();
        console.log("Received request data:", JSON.stringify(requestData).substring(0, 200) + "...");
      } catch (error) {
        console.error("Error parsing request JSON:", error);
      }
    }

    // Check if we're uploading custom municipality data
    if (requestData && 'customData' in requestData && requestData.customData) {
      const { municipalities, postalCodes } = requestData.customData;
      
      if (municipalities && Array.isArray(municipalities) && municipalities.length > 0) {
        console.log(`Received ${municipalities.length} custom municipalities`);
        
        // Clear existing municipalities if requested
        if (requestData.clearExisting) {
          console.log("Clearing existing municipalities as requested");
          await supabaseClient.from('municipalities').delete().neq('id', 0);
        }
        
        // Format municipalities for database insertion
        const formattedMunicipalities = municipalities.map(m => ({
          name: m.name,
          province_code: m.province_code,
          postal_codes: m.postal_codes || (postalCodes ? [postalCodes[m.name] || "00000"] : ["00000"])
        }));
        
        // Insert in batches of 1000 to avoid request size limits
        const batchSize = 1000;
        for (let i = 0; i < formattedMunicipalities.length; i += batchSize) {
          const batch = formattedMunicipalities.slice(i, i + batchSize);
          const { error } = await supabaseClient.from('municipalities').insert(batch);
          
          if (error) {
            console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
            return new Response(
              JSON.stringify({ error: `Failed to insert municipalities batch ${i / batchSize + 1}: ${error.message}` }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
        
        return new Response(
          JSON.stringify({ 
            message: "Custom municipalities uploaded successfully", 
            count: formattedMunicipalities.length 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get the specific province code from the request, if any
    let provinceCode = null;
    if (requestData && 'province' in requestData) {
      provinceCode = requestData.province;
      console.log(`Received request to populate municipalities for province: ${provinceCode}`);
    }

    // If a specific province is requested, only populate that province's municipalities
    if (provinceCode) {
      // Check if municipalities for this province already exist
      const { count, error: countError } = await supabaseClient
        .from('municipalities')
        .select('*', { count: 'exact', head: true })
        .eq('province_code', provinceCode);
      
      if (countError) {
        throw countError;
      }

      if (count && count > 0) {
        return new Response(
          JSON.stringify({ 
            message: `Municipalities for province ${provinceCode} already populated`, 
            count 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Filter municipalities for this province
      const provinceMunicipalities = municipalities.filter(m => m.province_code === provinceCode);
      
      if (provinceMunicipalities.length === 0) {
        console.log(`No predefined municipalities found for province ${provinceCode}`);
        
        // If we don't have predefined municipalities for this province, add some default entries
        const defaultMunicipalities = [
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
        
        // Insert default municipalities
        const { error: municipalitiesError } = await supabaseClient
          .from('municipalities')
          .insert(defaultMunicipalities);

        if (municipalitiesError) {
          throw municipalitiesError;
        }

        return new Response(
          JSON.stringify({ 
            message: `Added default municipalities for province ${provinceCode}`, 
            count: defaultMunicipalities.length 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Insert province municipalities
      const { error: municipalitiesError } = await supabaseClient
        .from('municipalities')
        .insert(provinceMunicipalities);

      if (municipalitiesError) {
        throw municipalitiesError;
      }

      return new Response(
        JSON.stringify({ 
          message: `Municipalities for province ${provinceCode} populated successfully`, 
          count: provinceMunicipalities.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // First check if we already have data
    const { count: provinceCount, error: countError } = await supabaseClient
      .from('provinces')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    // Check if we have municipalities data
    const { count: municipalityCount, error: municipalityCountError } = await supabaseClient
      .from('municipalities')
      .select('*', { count: 'exact', head: true });

    if (municipalityCountError) {
      throw municipalityCountError;
    }

    // If provinces exist but municipalities don't, only populate municipalities
    if (provinceCount && provinceCount > 0 && (!municipalityCount || municipalityCount === 0)) {
      // Insert municipalities
      const { error: municipalitiesError } = await supabaseClient
        .from('municipalities')
        .insert(municipalities);

      if (municipalitiesError) {
        throw municipalitiesError;
      }

      return new Response(
        JSON.stringify({ 
          message: "Municipalities populated successfully", 
          count: municipalities.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If both provinces and municipalities exist, return information
    if (provinceCount && provinceCount > 0 && municipalityCount && municipalityCount > 0) {
      return new Response(
        JSON.stringify({ 
          message: "Data already populated", 
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
      throw provincesError;
    }

    // Insert municipalities
    const { error: municipalitiesError } = await supabaseClient
      .from('municipalities')
      .insert(municipalities);

    if (municipalitiesError) {
      throw municipalitiesError;
    }

    return new Response(
      JSON.stringify({ 
        message: "Data populated successfully", 
        provincesCount: provinces.length,
        municipalitiesCount: municipalities.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in populate-italian-locations function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
