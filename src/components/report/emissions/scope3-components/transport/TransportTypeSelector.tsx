
import React from 'react';
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TransportType } from '@/lib/emissions-types';

interface TransportTypeSelectorProps {
  transportType: TransportType;
  setTransportType: (value: TransportType) => void;
}

const TransportTypeSelector: React.FC<TransportTypeSelectorProps> = ({
  transportType,
  setTransportType
}) => {
  return (
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
  );
};

export default TransportTypeSelector;
