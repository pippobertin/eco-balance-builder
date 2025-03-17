
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

// Example municipalities data - in a real scenario, this would be a complete dataset
const municipalities: Municipality[] = [
  // Roma municipalities
  { name: "Roma", province_code: "RM", postal_codes: ["00100", "00118", "00121", "00122", "00123", "00124", "00125", "00126", "00127", "00128", "00131", "00133", "00135", "00136", "00137", "00138", "00139", "00141", "00142", "00143", "00144", "00145", "00146", "00147", "00148", "00149", "00151", "00152", "00153", "00154", "00155", "00156", "00159", "00161", "00162", "00164", "00165", "00167", "00168", "00169", "00171", "00172", "00173", "00174", "00175", "00176", "00177", "00178", "00179", "00181", "00182", "00183", "00184", "00185", "00186", "00187", "00188", "00189", "00191", "00192", "00193", "00195", "00196", "00197", "00198", "00199"] },
  { name: "Fiumicino", province_code: "RM", postal_codes: ["00054", "00050", "00057"] },
  { name: "Ciampino", province_code: "RM", postal_codes: ["00043"] },
  
  // Milano municipalities
  { name: "Milano", province_code: "MI", postal_codes: ["20121", "20122", "20123", "20124", "20125", "20126", "20127", "20128", "20129", "20131", "20132", "20133", "20134", "20135", "20136", "20137", "20138", "20139", "20141", "20142", "20143", "20144", "20145", "20146", "20147", "20148", "20149", "20151", "20152", "20153", "20154", "20155", "20156", "20157", "20158", "20159", "20161", "20162"] },
  { name: "Segrate", province_code: "MI", postal_codes: ["20090"] },
  { name: "Corsico", province_code: "MI", postal_codes: ["20094"] },
  
  // Napoli municipalities
  { name: "Napoli", province_code: "NA", postal_codes: ["80100", "80121", "80122", "80123", "80124", "80125", "80126", "80127", "80128", "80129", "80131", "80132", "80133", "80134", "80135", "80136", "80137", "80138", "80139", "80141", "80142", "80143", "80144", "80145", "80146", "80147"] },
  { name: "Pozzuoli", province_code: "NA", postal_codes: ["80078"] },
  { name: "Portici", province_code: "NA", postal_codes: ["80055"] },
  
  // Torino municipalities
  { name: "Torino", province_code: "TO", postal_codes: ["10121", "10122", "10123", "10124", "10125", "10126", "10127", "10128", "10129", "10131", "10132", "10133", "10134", "10135", "10136", "10137", "10138", "10139", "10141", "10142", "10143", "10144", "10145", "10146", "10147", "10148", "10149", "10151", "10152", "10153", "10154", "10155", "10156"] },
  { name: "Moncalieri", province_code: "TO", postal_codes: ["10024"] },
  { name: "Rivoli", province_code: "TO", postal_codes: ["10098"] },
  
  // Bologna municipalities
  { name: "Bologna", province_code: "BO", postal_codes: ["40121", "40122", "40123", "40124", "40125", "40126", "40127", "40128", "40129", "40131", "40132", "40133", "40134", "40135", "40136", "40137", "40138", "40139"] },
  { name: "Casalecchio di Reno", province_code: "BO", postal_codes: ["40033"] },
  { name: "San Lazzaro di Savena", province_code: "BO", postal_codes: ["40068"] },
  
  // Firenze municipalities
  { name: "Firenze", province_code: "FI", postal_codes: ["50121", "50122", "50123", "50124", "50125", "50126", "50127", "50128", "50129", "50131", "50132", "50133", "50134", "50135", "50136", "50137", "50138", "50139", "50141", "50142", "50143", "50144", "50145"] },
  { name: "Sesto Fiorentino", province_code: "FI", postal_codes: ["50019"] },
  { name: "Scandicci", province_code: "FI", postal_codes: ["50018"] },
  
  // Bari municipalities
  { name: "Bari", province_code: "BA", postal_codes: ["70121", "70122", "70123", "70124", "70125", "70126", "70127", "70128", "70129", "70131", "70132"] },
  { name: "Modugno", province_code: "BA", postal_codes: ["70026"] },
  { name: "Altamura", province_code: "BA", postal_codes: ["70022"] },
  
  // Sample for other provinces
  { name: "Verona", province_code: "VR", postal_codes: ["37121", "37122", "37123", "37124", "37125", "37126", "37127", "37128", "37129", "37131", "37132", "37133", "37134", "37135", "37136", "37137", "37138", "37139", "37141", "37142"] },
  { name: "Venezia", province_code: "VE", postal_codes: ["30121", "30122", "30123", "30124", "30125", "30126", "30127", "30128", "30129", "30131", "30132", "30133", "30134", "30135", "30136", "30137", "30138", "30139", "30141", "30142"] },
  { name: "Genova", province_code: "GE", postal_codes: ["16121", "16122", "16123", "16124", "16125", "16126", "16127", "16128", "16129", "16131", "16132", "16133", "16134", "16135", "16136", "16137", "16138", "16139", "16141", "16142", "16143", "16144", "16145", "16146", "16147", "16148", "16149"] },
  { name: "Palermo", province_code: "PA", postal_codes: ["90121", "90122", "90123", "90124", "90125", "90126", "90127", "90128", "90129", "90131", "90132", "90133", "90134", "90135", "90136", "90137", "90138", "90139", "90141", "90142", "90143", "90144", "90145", "90146", "90147"] },
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

    // First check if we already have data
    const { count: provinceCount, error: countError } = await supabaseClient
      .from('provinces')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    if (provinceCount && provinceCount > 0) {
      return new Response(
        JSON.stringify({ message: "Data already populated", count: provinceCount }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
