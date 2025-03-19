
import React, { useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransportType, FuelType } from '@/lib/emissions-types';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import VehicleEmissionInfo from './VehicleEmissionInfo';

// Vehicle types
const VEHICLE_TYPES = [
  { value: "car_small", label: "Auto piccola cilindrata (<1.4L)" },
  { value: "car_medium", label: "Auto media cilindrata (1.4-2.0L)" },
  { value: "car_large", label: "Auto grande cilindrata (>2.0L)" },
  { value: "van_small", label: "Furgone piccolo (<1.5t)" },
  { value: "van_medium", label: "Furgone medio (1.5-3.5t)" },
  { value: "truck_small", label: "Camion piccolo (3.5-7.5t)" },
  { value: "truck_medium", label: "Camion medio (7.5-16t)" },
  { value: "truck_large", label: "Camion pesante (>16t)" },
  { value: "truck_articulated", label: "Autoarticolato" }
];

// Vehicle energy classes
const ENERGY_CLASSES = [
  { value: "euro6", label: "Euro 6" },
  { value: "euro5", label: "Euro 5" },
  { value: "euro4", label: "Euro 4" },
  { value: "euro3", label: "Euro 3" },
  { value: "euro2", label: "Euro 2" },
  { value: "euro1", label: "Euro 1" },
  { value: "euro0", label: "Euro 0" }
];

interface TransportSectionProps {
  transportType: TransportType;
  setTransportType: (value: TransportType) => void;
  transportDistance: string;
  setTransportDistance: (value: string) => void;
  vehicleType: string;
  setVehicleType: (value: string) => void;
  vehicleFuelType: FuelType;
  setVehicleFuelType: (value: FuelType) => void;
  vehicleEnergyClass: string;
  setVehicleEnergyClass: (value: string) => void;
}

const TransportSection: React.FC<TransportSectionProps> = ({
  transportType,
  setTransportType,
  transportDistance,
  setTransportDistance,
  vehicleType,
  setVehicleType,
  vehicleFuelType,
  setVehicleFuelType,
  vehicleEnergyClass,
  setVehicleEnergyClass
}) => {
  // Check if we're in a transport category that requires vehicle details
  const showVehicleDetails = transportType === 'FREIGHT_ROAD' || transportType === 'BUSINESS_TRAVEL_CAR';
  
  // Check if all vehicle details are provided
  const hasCompleteVehicleDetails = vehicleType && vehicleFuelType && vehicleEnergyClass;
  
  // Set default values if transport type changes
  useEffect(() => {
    if (showVehicleDetails && !vehicleType) {
      if (transportType === 'BUSINESS_TRAVEL_CAR') {
        setVehicleType('car_medium');
      } else if (transportType === 'FREIGHT_ROAD') {
        setVehicleType('truck_medium');
      }
      
      if (!vehicleEnergyClass) {
        setVehicleEnergyClass('euro6');
      }
      
      if (!vehicleFuelType) {
        setVehicleFuelType('DIESEL');
      }
    }
  }, [transportType, showVehicleDetails, vehicleType, vehicleEnergyClass, vehicleFuelType]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Tipo di trasporto</Label>
          <Select 
            value={transportType} 
            onValueChange={(value) => setTransportType(value as TransportType)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Seleziona tipo di trasporto" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="FREIGHT_ROAD">Trasporto merci su strada</SelectItem>
              <SelectItem value="FREIGHT_RAIL">Trasporto merci su rotaia</SelectItem>
              <SelectItem value="FREIGHT_SEA">Trasporto merci via mare</SelectItem>
              <SelectItem value="FREIGHT_AIR">Trasporto merci via aerea</SelectItem>
              <SelectItem value="BUSINESS_TRAVEL_CAR">Viaggi di lavoro in auto</SelectItem>
              <SelectItem value="BUSINESS_TRAVEL_TRAIN">Viaggi di lavoro in treno</SelectItem>
              <SelectItem value="BUSINESS_TRAVEL_FLIGHT_SHORT">Viaggi di lavoro in aereo (corto raggio)</SelectItem>
              <SelectItem value="BUSINESS_TRAVEL_FLIGHT_LONG">Viaggi di lavoro in aereo (lungo raggio)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Distanza percorsa (km)</Label>
          <Input 
            type="number" 
            value={transportDistance} 
            onChange={(e) => setTransportDistance(e.target.value)}
            placeholder="Inserisci distanza in km"
            className="bg-white"
          />
        </div>
      </div>
      
      {showVehicleDetails && (
        <div className="border rounded-md p-3 bg-blue-50 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-blue-700">Dettagli veicolo</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoCircledIcon className="h-5 w-5 text-blue-600" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm p-4 bg-white shadow-lg rounded-md">
                  <div className="space-y-2">
                    <p className="font-medium">Fattori di emissione specifici per veicolo</p>
                    <p className="text-sm text-gray-600">
                      I fattori di emissione utilizzati sono basati sulla combinazione di tipo di veicolo, 
                      classe Euro e carburante, secondo i dati ADEME e EEA.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Tipo di veicolo</Label>
              <Select 
                value={vehicleType} 
                onValueChange={setVehicleType}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleziona veicolo" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {VEHICLE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Tipo di carburante</Label>
              <Select 
                value={vehicleFuelType} 
                onValueChange={(value) => setVehicleFuelType(value as FuelType)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleziona carburante" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="DIESEL">Diesel</SelectItem>
                  <SelectItem value="GASOLINE">Benzina</SelectItem>
                  <SelectItem value="LPG">GPL</SelectItem>
                  <SelectItem value="NATURAL_GAS">Metano</SelectItem>
                  <SelectItem value="BIOFUEL">Biocarburante</SelectItem>
                  <SelectItem value="HYBRID">Ibrido</SelectItem>
                  <SelectItem value="ELECTRIC">Full Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Classe Euro</Label>
              <Select 
                value={vehicleEnergyClass} 
                onValueChange={setVehicleEnergyClass}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleziona classe" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {ENERGY_CLASSES.map(cls => (
                    <SelectItem key={cls.value} value={cls.value}>{cls.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {hasCompleteVehicleDetails && (
            <div className="mt-2">
              <VehicleEmissionInfo 
                vehicleType={vehicleType}
                vehicleFuelType={vehicleFuelType}
                vehicleEnergyClass={vehicleEnergyClass}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransportSection;
