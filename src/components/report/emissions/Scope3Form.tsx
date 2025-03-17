
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
import { TransportType, WasteType, PurchaseType, PeriodType } from '@/lib/emissions-types';

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
}

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
  setPeriodType
}) => {
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
    </div>
  );
};

export default Scope3Form;
