
import React, { useMemo } from 'react';
import { getVehicleEmissionFactor, getVehicleEmissionFactorSource } from '@/lib/vehicle-emissions-factors';
import { FuelType } from '@/lib/emissions-types';
import { Card } from '@/components/ui/card';

interface VehicleEmissionInfoProps {
  vehicleType: string;
  vehicleFuelType: FuelType;
  vehicleEnergyClass: string;
  vehicleFuelConsumption?: string;
  vehicleFuelConsumptionUnit?: string;
  showCard?: boolean;
}

const VehicleEmissionInfo: React.FC<VehicleEmissionInfoProps> = ({
  vehicleType,
  vehicleFuelType,
  vehicleEnergyClass,
  vehicleFuelConsumption,
  vehicleFuelConsumptionUnit = 'l_100km',
  showCard = true
}) => {
  const hasAllDetails = vehicleType && vehicleFuelType && vehicleEnergyClass;
  
  // Get emission factor and source only if all three parameters are provided
  const emissionFactor = useMemo(() => {
    if (hasAllDetails) {
      return getVehicleEmissionFactor(vehicleType, vehicleEnergyClass, vehicleFuelType);
    }
    return null;
  }, [vehicleType, vehicleFuelType, vehicleEnergyClass, hasAllDetails]);
  
  const emissionSource = useMemo(() => {
    if (hasAllDetails) {
      return getVehicleEmissionFactorSource(vehicleType, vehicleEnergyClass, vehicleFuelType);
    }
    return null;
  }, [vehicleType, vehicleFuelType, vehicleEnergyClass, hasAllDetails]);
  
  if (!hasAllDetails) {
    return null;
  }
  
  // Map vehicle types to readable names
  const vehicleTypeMap: Record<string, string> = {
    car_small: "Auto piccola cilindrata",
    car_medium: "Auto media cilindrata",
    car_large: "Auto grande cilindrata",
    van_small: "Furgone piccolo",
    van_medium: "Furgone medio",
    truck_small: "Camion piccolo",
    truck_medium: "Camion medio",
    truck_large: "Camion pesante",
    truck_articulated: "Autoarticolato"
  };
  
  // Map fuel types to readable names
  const fuelTypeMap: Record<string, string> = {
    DIESEL: "Diesel",
    GASOLINE: "Benzina",
    LPG: "GPL",
    NATURAL_GAS: "Metano",
    BIOFUEL: "Biocarburante",
    HYBRID: "Ibrido", 
    ELECTRIC: "Full Electric"
  };
  
  const readableVehicleType = vehicleTypeMap[vehicleType] || vehicleType;
  const readableFuelType = fuelTypeMap[vehicleFuelType] || vehicleFuelType;
  const readableEuroClass = vehicleEnergyClass.toUpperCase().replace("EURO", "Euro ");
  
  // Format consumption for display
  const formattedConsumption = vehicleFuelConsumption ? 
    `${vehicleFuelConsumption} ${vehicleFuelConsumptionUnit === 'l_100km' ? 'L/100km' : 'km/L'}` : 
    "Non specificato";
  
  const content = (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-1 text-sm">
        <span className="text-gray-500">Fattore di emissione:</span>
        <span className="font-medium">{emissionFactor} g CO₂e/km</span>
        
        <span className="text-gray-500">Veicolo:</span>
        <span>{readableVehicleType}</span>
        
        <span className="text-gray-500">Carburante:</span>
        <span>{readableFuelType}</span>
        
        <span className="text-gray-500">Classe:</span>
        <span>{readableEuroClass}</span>
        
        <span className="text-gray-500">Consumo:</span>
        <span>{formattedConsumption}</span>
      </div>
      
      {emissionSource && (
        <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
          Fonte: {emissionSource}
        </div>
      )}
    </div>
  );
  
  if (showCard) {
    return (
      <Card className="p-3 bg-gray-50 border border-gray-200">
        <h5 className="text-sm font-medium mb-2 text-gray-700">Dettagli fattore di emissione</h5>
        {content}
      </Card>
    );
  }
  
  return content;
};

export default VehicleEmissionInfo;
