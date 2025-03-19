
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
import { TransportType, WasteType, PurchaseType, PeriodType, FuelType } from '@/lib/emissions-types';

interface Scope3FormProps {
  scope3Category: string;
  setScope3Category: (value: string) => void;
  // Transport props
  transportType: TransportType;
  setTransportType: (value: TransportType) => void;
  transportDistance: string;
  setTransportDistance: (value: string) => void;
  // Waste props
  wasteType: WasteType;
  setWasteType: (value: WasteType) => void;
  wasteQuantity: string;
  setWasteQuantity: (value: string) => void;
  // Purchase props
  purchaseType: PurchaseType;
  setPurchaseType: (value: PurchaseType) => void;
  purchaseQuantity: string;
  setPurchaseQuantity: (value: string) => void;
  // Common props
  periodType: PeriodType;
  setPeriodType: (value: PeriodType) => void;
  // New transport related props
  vehicleType?: string;
  setVehicleType?: (value: string) => void;
  vehicleFuelType?: FuelType;
  setVehicleFuelType?: (value: FuelType) => void;
  vehicleEnergyClass?: string;
  setVehicleEnergyClass?: (value: string) => void;
}

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

const Scope3Form: React.FC<Scope3FormProps> = ({
  scope3Category,
  setScope3Category,
  transportType,
  setTransportType,
  transportDistance,
  setTransportDistance,
  wasteType,
  setWasteType,
  wasteQuantity,
  setWasteQuantity,
  purchaseType,
  setPurchaseType,
  purchaseQuantity,
  setPurchaseQuantity,
  periodType,
  setPeriodType,
  vehicleType = "",
  setVehicleType = () => {},
  vehicleFuelType = "DIESEL",
  setVehicleFuelType = () => {},
  vehicleEnergyClass = "",
  setVehicleEnergyClass = () => {}
}) => {
  // Check if we're in a transport category that requires vehicle details
  const showVehicleDetails = scope3Category === 'transport' && 
    (transportType === 'FREIGHT_ROAD' || transportType === 'BUSINESS_TRAVEL_CAR');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Categoria</Label>
          <Select 
            value={scope3Category} 
            onValueChange={setScope3Category}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Seleziona categoria" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="transport">Trasporto e Logistica</SelectItem>
              <SelectItem value="waste">Gestione Rifiuti</SelectItem>
              <SelectItem value="purchases">Acquisto di beni e servizi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {scope3Category === 'transport' && (
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
      )}
      
      {scope3Category === 'waste' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tipo di rifiuto</Label>
            <Select 
              value={wasteType} 
              onValueChange={(value) => setWasteType(value as WasteType)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Seleziona tipo di rifiuto" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="WASTE_LANDFILL">Rifiuti in discarica</SelectItem>
                <SelectItem value="WASTE_RECYCLED">Rifiuti riciclati</SelectItem>
                <SelectItem value="WASTE_INCINERATION">Rifiuti inceneriti</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Quantità di rifiuti (kg)</Label>
            <Input 
              type="number" 
              value={wasteQuantity} 
              onChange={(e) => setWasteQuantity(e.target.value)}
              placeholder="Inserisci quantità in kg"
              className="bg-white"
            />
          </div>
        </div>
      )}
      
      {scope3Category === 'purchases' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tipo di acquisto</Label>
            <Select 
              value={purchaseType} 
              onValueChange={(value) => setPurchaseType(value as PurchaseType)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Seleziona tipo di acquisto" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="PURCHASED_GOODS">Beni acquistati</SelectItem>
                <SelectItem value="PURCHASED_SERVICES">Servizi acquistati</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Quantità</Label>
            <Input 
              type="number" 
              value={purchaseQuantity} 
              onChange={(e) => setPurchaseQuantity(e.target.value)}
              placeholder={purchaseType === 'PURCHASED_GOODS' ? "Inserisci quantità in kg" : "Inserisci numero di unità"}
              className="bg-white"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Periodo di riferimento</Label>
          <Select 
            value={periodType} 
            onValueChange={(value) => setPeriodType(value as PeriodType)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Seleziona periodo" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value={PeriodType.ANNUAL}>Annuale</SelectItem>
              <SelectItem value={PeriodType.QUARTERLY}>Trimestrale</SelectItem>
              <SelectItem value={PeriodType.MONTHLY}>Mensile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Scope3Form;
