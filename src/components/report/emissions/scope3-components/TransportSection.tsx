
import React from 'react';
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
          <h4 className="font-medium text-blue-700">Dettagli veicolo</h4>
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
              <Label>Classe energetica</Label>
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
        </div>
      )}
    </div>
  );
};

export default TransportSection;
