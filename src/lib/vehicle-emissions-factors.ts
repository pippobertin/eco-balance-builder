
import { EmissionFactorSource } from './emissions-types';

export interface VehicleEmissionFactor {
  vehicleType: string;
  euroClass: string;
  fuelType: string;
  emissionFactor: number; // g CO2e/km
  source: EmissionFactorSource | string;
  description?: string;
}

// Complete vehicle emissions factors database from provided data
export const VEHICLE_EMISSION_FACTORS: VehicleEmissionFactor[] = [
  // Auto Piccola Cilindrata
  { vehicleType: "car_small", euroClass: "euro0", fuelType: "GASOLINE", emissionFactor: 240, source: "ADEME Base Carbone (Stima Euro 0 Benzina)" },
  { vehicleType: "car_small", euroClass: "euro0", fuelType: "DIESEL", emissionFactor: 210, source: "ADEME Base Carbone (Stima Euro 0 Diesel)" },
  { vehicleType: "car_small", euroClass: "euro1", fuelType: "GASOLINE", emissionFactor: 210, source: "ADEME Base Carbone (Stima Euro 1 Benzina)" },
  { vehicleType: "car_small", euroClass: "euro1", fuelType: "DIESEL", emissionFactor: 180, source: "ADEME Base Carbone (Stima Euro 1 Diesel)" },
  { vehicleType: "car_small", euroClass: "euro2", fuelType: "GASOLINE", emissionFactor: 180, source: "ADEME Base Carbone (Stima Euro 2 Benzina)" },
  { vehicleType: "car_small", euroClass: "euro2", fuelType: "DIESEL", emissionFactor: 150, source: "ADEME Base Carbone (Stima Euro 2 Diesel)" },
  { vehicleType: "car_small", euroClass: "euro3", fuelType: "GASOLINE", emissionFactor: 160, source: "EEA - Average emissions new passenger cars, EU, 2001-2005 (Stima Euro 3)" },
  { vehicleType: "car_small", euroClass: "euro3", fuelType: "DIESEL", emissionFactor: 135, source: "EEA - Average emissions new passenger cars, EU, 2001-2005 (Stima Euro 3)" },
  { vehicleType: "car_small", euroClass: "euro4", fuelType: "GASOLINE", emissionFactor: 140, source: "EEA - Average emissions new passenger cars, EU, 2006-2010 (Stima Euro 4)" },
  { vehicleType: "car_small", euroClass: "euro4", fuelType: "DIESEL", emissionFactor: 120, source: "EEA - Average emissions new passenger cars, EU, 2006-2010 (Stima Euro 4)" },
  { vehicleType: "car_small", euroClass: "euro5", fuelType: "GASOLINE", emissionFactor: 125, source: "EEA - Average emissions new passenger cars, EU, 2011-2015 (Stima Euro 5)" },
  { vehicleType: "car_small", euroClass: "euro5", fuelType: "DIESEL", emissionFactor: 110, source: "EEA - Average emissions new passenger cars, EU, 2011-2015 (Stima Euro 5)" },
  { vehicleType: "car_small", euroClass: "euro6", fuelType: "GASOLINE", emissionFactor: 115, source: "EEA - Monitoring CO2 emissions from passenger cars - 2023 data" },
  { vehicleType: "car_small", euroClass: "euro6", fuelType: "DIESEL", emissionFactor: 105, source: "EEA - Monitoring CO2 emissions from passenger cars - 2023 data" },
  { vehicleType: "car_small", euroClass: "euro6", fuelType: "LPG", emissionFactor: 125, source: "ADEME Base Carbone (Stima media GPL auto)" },
  { vehicleType: "car_small", euroClass: "euro6", fuelType: "NATURAL_GAS", emissionFactor: 90, source: "ADEME Base Carbone (Stima media Metano auto)" },
  { vehicleType: "car_small", euroClass: "euro6", fuelType: "ELECTRIC", emissionFactor: 32, source: "EEA - Well-to-wheel GHG emissions for electricity in Europe (2023)" },
  { vehicleType: "car_small", euroClass: "euro6", fuelType: "HYBRID", emissionFactor: 65, source: "Stima intermedia tra Benzina Euro 6 e Elettrico Euro 6" },
  
  // Auto Media Cilindrata
  { vehicleType: "car_medium", euroClass: "euro0", fuelType: "GASOLINE", emissionFactor: 280, source: "Stima proporzionale da Piccola Cilindrata Euro 0" },
  { vehicleType: "car_medium", euroClass: "euro0", fuelType: "DIESEL", emissionFactor: 245, source: "Stima proporzionale da Piccola Cilindrata Euro 0" },
  { vehicleType: "car_medium", euroClass: "euro1", fuelType: "GASOLINE", emissionFactor: 245, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Media Cilindrata" },
  { vehicleType: "car_medium", euroClass: "euro1", fuelType: "DIESEL", emissionFactor: 215, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Media Cilindrata" },
  { vehicleType: "car_medium", euroClass: "euro2", fuelType: "GASOLINE", emissionFactor: 215, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Media Cilindrata" },
  { vehicleType: "car_medium", euroClass: "euro2", fuelType: "DIESEL", emissionFactor: 195, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Media Cilindrata" },
  { vehicleType: "car_medium", euroClass: "euro3", fuelType: "GASOLINE", emissionFactor: 190, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Media Cilindrata" },
  { vehicleType: "car_medium", euroClass: "euro3", fuelType: "DIESEL", emissionFactor: 175, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Media Cilindrata" },
  { vehicleType: "car_medium", euroClass: "euro4", fuelType: "GASOLINE", emissionFactor: 175, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Media Cilindrata" },
  { vehicleType: "car_medium", euroClass: "euro4", fuelType: "DIESEL", emissionFactor: 160, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Media Cilindrata" },
  { vehicleType: "car_medium", euroClass: "euro5", fuelType: "GASOLINE", emissionFactor: 155, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Media Cilindrata" },
  { vehicleType: "car_medium", euroClass: "euro5", fuelType: "DIESEL", emissionFactor: 140, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Media Cilindrata" },
  { vehicleType: "car_medium", euroClass: "euro6", fuelType: "GASOLINE", emissionFactor: 140, source: "EEA - Monitoring CO2 emissions from passenger cars - 2023 data" },
  { vehicleType: "car_medium", euroClass: "euro6", fuelType: "DIESEL", emissionFactor: 125, source: "EEA - Monitoring CO2 emissions from passenger cars - 2023 data" },
  { vehicleType: "car_medium", euroClass: "euro6", fuelType: "LPG", emissionFactor: 145, source: "ADEME Base Carbone (Stima media GPL auto media)" },
  { vehicleType: "car_medium", euroClass: "euro6", fuelType: "NATURAL_GAS", emissionFactor: 105, source: "ADEME Base Carbone (Stima media Metano auto media)" },
  { vehicleType: "car_medium", euroClass: "euro6", fuelType: "ELECTRIC", emissionFactor: 35, source: "EEA - Well-to-wheel GHG emissions for electricity in Europe (2023)" },
  { vehicleType: "car_medium", euroClass: "euro6", fuelType: "HYBRID", emissionFactor: 75, source: "Stima intermedia tra Benzina Euro 6 e Elettrico Euro 6" },
  
  // Auto Grossa Cilindrata
  { vehicleType: "car_large", euroClass: "euro0", fuelType: "GASOLINE", emissionFactor: 320, source: "Stima proporzionale da Piccola Cilindrata Euro 0" },
  { vehicleType: "car_large", euroClass: "euro0", fuelType: "DIESEL", emissionFactor: 280, source: "Stima proporzionale da Piccola Cilindrata Euro 0" },
  { vehicleType: "car_large", euroClass: "euro1", fuelType: "GASOLINE", emissionFactor: 290, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Grossa Cilindrata" },
  { vehicleType: "car_large", euroClass: "euro1", fuelType: "DIESEL", emissionFactor: 255, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Grossa Cilindrata" },
  { vehicleType: "car_large", euroClass: "euro2", fuelType: "GASOLINE", emissionFactor: 260, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Grossa Cilindrata" },
  { vehicleType: "car_large", euroClass: "euro2", fuelType: "DIESEL", emissionFactor: 235, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Grossa Cilindrata" },
  { vehicleType: "car_large", euroClass: "euro3", fuelType: "GASOLINE", emissionFactor: 230, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Grossa Cilindrata" },
  { vehicleType: "car_large", euroClass: "euro3", fuelType: "DIESEL", emissionFactor: 215, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Grossa Cilindrata" },
  { vehicleType: "car_large", euroClass: "euro4", fuelType: "GASOLINE", emissionFactor: 210, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Grossa Cilindrata" },
  { vehicleType: "car_large", euroClass: "euro4", fuelType: "DIESEL", emissionFactor: 195, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Grossa Cilindrata" },
  { vehicleType: "car_large", euroClass: "euro5", fuelType: "GASOLINE", emissionFactor: 180, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Grossa Cilindrata" },
  { vehicleType: "car_large", euroClass: "euro5", fuelType: "DIESEL", emissionFactor: 165, source: "Stima interpolata tra Euro 0 e Euro 6 per Auto Grossa Cilindrata" },
  { vehicleType: "car_large", euroClass: "euro6", fuelType: "GASOLINE", emissionFactor: 160, source: "EEA - Monitoring CO2 emissions from passenger cars - 2023 data" },
  { vehicleType: "car_large", euroClass: "euro6", fuelType: "DIESEL", emissionFactor: 140, source: "EEA - Monitoring CO2 emissions from passenger cars - 2023 data" },
  { vehicleType: "car_large", euroClass: "euro6", fuelType: "LPG", emissionFactor: 165, source: "ADEME Base Carbone (Stima media GPL auto grossa)" },
  { vehicleType: "car_large", euroClass: "euro6", fuelType: "NATURAL_GAS", emissionFactor: 120, source: "ADEME Base Carbone (Stima media Metano auto grossa)" },
  { vehicleType: "car_large", euroClass: "euro6", fuelType: "ELECTRIC", emissionFactor: 40, source: "EEA - Well-to-wheel GHG emissions for electricity in Europe (2023)" },
  { vehicleType: "car_large", euroClass: "euro6", fuelType: "HYBRID", emissionFactor: 85, source: "Stima intermedia tra Benzina Euro 6 e Elettrico Euro 6" },
  
  // Furgone Piccolo
  { vehicleType: "van_small", euroClass: "euro0", fuelType: "DIESEL", emissionFactor: 320, source: "ADEME Base Carbone (Stima Furgone Euro 0)" },
  { vehicleType: "van_small", euroClass: "euro1", fuelType: "DIESEL", emissionFactor: 295, source: "Stima interpolata tra Euro 0 e Euro 6 per Furgone Piccolo" },
  { vehicleType: "van_small", euroClass: "euro2", fuelType: "DIESEL", emissionFactor: 270, source: "Stima interpolata tra Euro 0 e Euro 6 per Furgone Piccolo" },
  { vehicleType: "van_small", euroClass: "euro3", fuelType: "DIESEL", emissionFactor: 250, source: "Stima interpolata tra Euro 0 e Euro 6 per Furgone Piccolo" },
  { vehicleType: "van_small", euroClass: "euro4", fuelType: "DIESEL", emissionFactor: 230, source: "Stima interpolata tra Euro 0 e Euro 6 per Furgone Piccolo" },
  { vehicleType: "van_small", euroClass: "euro5", fuelType: "DIESEL", emissionFactor: 200, source: "Stima interpolata tra Euro 0 e Euro 6 per Furgone Piccolo" },
  { vehicleType: "van_small", euroClass: "euro6", fuelType: "DIESEL", emissionFactor: 180, source: "EEA - Average emissions new light commercial vehicles, EU, 2023" },
  { vehicleType: "van_small", euroClass: "euro6", fuelType: "ELECTRIC", emissionFactor: 45, source: "EEA - Well-to-wheel GHG emissions for electricity in Europe (2023)" },
  
  // Furgone Medio
  { vehicleType: "van_medium", euroClass: "euro0", fuelType: "DIESEL", emissionFactor: 400, source: "ADEME Base Carbone (Stima Furgone Euro 0 medio)" },
  { vehicleType: "van_medium", euroClass: "euro1", fuelType: "DIESEL", emissionFactor: 365, source: "Stima interpolata tra Euro 0 e Euro 6 per Furgone Medio" },
  { vehicleType: "van_medium", euroClass: "euro2", fuelType: "DIESEL", emissionFactor: 335, source: "Stima interpolata tra Euro 0 e Euro 6 per Furgone Medio" },
  { vehicleType: "van_medium", euroClass: "euro3", fuelType: "DIESEL", emissionFactor: 310, source: "Stima interpolata tra Euro 0 e Euro 6 per Furgone Medio" },
  { vehicleType: "van_medium", euroClass: "euro4", fuelType: "DIESEL", emissionFactor: 280, source: "Stima interpolata tra Euro 0 e Euro 6 per Furgone Medio" },
  { vehicleType: "van_medium", euroClass: "euro5", fuelType: "DIESEL", emissionFactor: 250, source: "Stima interpolata tra Euro 0 e Euro 6 per Furgone Medio" },
  { vehicleType: "van_medium", euroClass: "euro6", fuelType: "DIESEL", emissionFactor: 220, source: "EEA - Average emissions new light commercial vehicles, EU, 2023" },
  { vehicleType: "van_medium", euroClass: "euro6", fuelType: "ELECTRIC", emissionFactor: 55, source: "EEA - Well-to-wheel GHG emissions for electricity in Europe (2023)" },
  
  // Camion Piccolo
  { vehicleType: "truck_small", euroClass: "euro0", fuelType: "DIESEL", emissionFactor: 700, source: "ADEME Base Carbone (Stima Camion Euro 0 piccolo)" },
  { vehicleType: "truck_small", euroClass: "euro1", fuelType: "DIESEL", emissionFactor: 645, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Piccolo" },
  { vehicleType: "truck_small", euroClass: "euro2", fuelType: "DIESEL", emissionFactor: 590, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Piccolo" },
  { vehicleType: "truck_small", euroClass: "euro3", fuelType: "DIESEL", emissionFactor: 540, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Piccolo" },
  { vehicleType: "truck_small", euroClass: "euro4", fuelType: "DIESEL", emissionFactor: 490, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Piccolo" },
  { vehicleType: "truck_small", euroClass: "euro5", fuelType: "DIESEL", emissionFactor: 445, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Piccolo" },
  { vehicleType: "truck_small", euroClass: "euro6", fuelType: "DIESEL", emissionFactor: 400, source: "EEA - Average emissions new heavy commercial vehicles, EU, 2023" },
  
  // Camion Medio
  { vehicleType: "truck_medium", euroClass: "euro0", fuelType: "DIESEL", emissionFactor: 900, source: "ADEME Base Carbone (Stima Camion Euro 0 medio)" },
  { vehicleType: "truck_medium", euroClass: "euro1", fuelType: "DIESEL", emissionFactor: 835, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Medio" },
  { vehicleType: "truck_medium", euroClass: "euro2", fuelType: "DIESEL", emissionFactor: 770, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Medio" },
  { vehicleType: "truck_medium", euroClass: "euro3", fuelType: "DIESEL", emissionFactor: 710, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Medio" },
  { vehicleType: "truck_medium", euroClass: "euro4", fuelType: "DIESEL", emissionFactor: 655, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Medio" },
  { vehicleType: "truck_medium", euroClass: "euro5", fuelType: "DIESEL", emissionFactor: 600, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Medio" },
  { vehicleType: "truck_medium", euroClass: "euro6", fuelType: "DIESEL", emissionFactor: 550, source: "EEA - Average emissions new heavy commercial vehicles, EU, 2023" },
  
  // Camion Pesante
  { vehicleType: "truck_large", euroClass: "euro0", fuelType: "DIESEL", emissionFactor: 1300, source: "ADEME Base Carbone (Stima Camion Euro 0 pesante)" },
  { vehicleType: "truck_large", euroClass: "euro1", fuelType: "DIESEL", emissionFactor: 1205, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Pesante" },
  { vehicleType: "truck_large", euroClass: "euro2", fuelType: "DIESEL", emissionFactor: 1115, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Pesante" },
  { vehicleType: "truck_large", euroClass: "euro3", fuelType: "DIESEL", emissionFactor: 1025, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Pesante" },
  { vehicleType: "truck_large", euroClass: "euro4", fuelType: "DIESEL", emissionFactor: 930, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Pesante" },
  { vehicleType: "truck_large", euroClass: "euro5", fuelType: "DIESEL", emissionFactor: 840, source: "Stima interpolata tra Euro 0 e Euro 6 per Camion Pesante" },
  { vehicleType: "truck_large", euroClass: "euro6", fuelType: "DIESEL", emissionFactor: 750, source: "EEA - Average emissions new heavy commercial vehicles, EU, 2023" },
  
  // Autoarticolato
  { vehicleType: "truck_articulated", euroClass: "euro0", fuelType: "DIESEL", emissionFactor: 1700, source: "Stima proporzionale da Camion Pesante Euro 0" },
  { vehicleType: "truck_articulated", euroClass: "euro1", fuelType: "DIESEL", emissionFactor: 1580, source: "Stima interpolata tra Euro 0 e Euro 6 per Autoarticolato" },
  { vehicleType: "truck_articulated", euroClass: "euro2", fuelType: "DIESEL", emissionFactor: 1465, source: "Stima interpolata tra Euro 0 e Euro 6 per Autoarticolato" },
  { vehicleType: "truck_articulated", euroClass: "euro3", fuelType: "DIESEL", emissionFactor: 1350, source: "Stima interpolata tra Euro 0 e Euro 6 per Autoarticolato" },
  { vehicleType: "truck_articulated", euroClass: "euro4", fuelType: "DIESEL", emissionFactor: 1230, source: "Stima interpolata tra Euro 0 e Euro 6 per Autoarticolato" },
  { vehicleType: "truck_articulated", euroClass: "euro5", fuelType: "DIESEL", emissionFactor: 1115, source: "Stima interpolata tra Euro 0 e Euro 6 per Autoarticolato" },
  { vehicleType: "truck_articulated", euroClass: "euro6", fuelType: "DIESEL", emissionFactor: 950, source: "Stima proporzionale da Camion Pesante Euro 6" }
];

// Function to get emission factor based on vehicle characteristics
export const getVehicleEmissionFactor = (
  vehicleType: string, 
  euroClass: string, 
  fuelType: string
): number => {
  // Find the matching emission factor
  const factor = VEHICLE_EMISSION_FACTORS.find(
    f => f.vehicleType === vehicleType && 
         f.euroClass === euroClass && 
         f.fuelType === fuelType
  );
  
  if (factor) {
    return factor.emissionFactor;
  }
  
  // If no exact match, try to find the closest match (same vehicle type and fuel type, but different Euro class)
  const closestMatch = VEHICLE_EMISSION_FACTORS.filter(
    f => f.vehicleType === vehicleType && f.fuelType === fuelType
  ).sort((a, b) => {
    // Sort by euroClass to get the closest one (euro6 is better than euro0)
    const aClass = parseInt(a.euroClass.replace('euro', '')) || 0;
    const bClass = parseInt(b.euroClass.replace('euro', '')) || 0;
    return bClass - aClass; // Higher euro class is better
  })[0];
  
  if (closestMatch) {
    console.warn(`Exact vehicle emission factor not found for ${vehicleType}, ${euroClass}, ${fuelType}. Using closest match: ${closestMatch.euroClass}`);
    return closestMatch.emissionFactor;
  }
  
  // Default values if nothing found
  console.warn(`No vehicle emission factor found for ${vehicleType}, ${euroClass}, ${fuelType}. Using default value.`);
  return 170; // Default value (approximate average for passenger cars)
};

// Get the source information for a specific vehicle emission factor
export const getVehicleEmissionFactorSource = (
  vehicleType: string, 
  euroClass: string, 
  fuelType: string
): string => {
  const factor = VEHICLE_EMISSION_FACTORS.find(
    f => f.vehicleType === vehicleType && 
         f.euroClass === euroClass && 
         f.fuelType === fuelType
  );
  
  return factor?.source || "Valore predefinito";
};
