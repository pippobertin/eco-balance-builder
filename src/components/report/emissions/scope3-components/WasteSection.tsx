
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
import { WasteType } from '@/lib/emissions-types';

interface WasteSectionProps {
  wasteType: WasteType;
  setWasteType: (value: WasteType) => void;
  wasteQuantity: string;
  setWasteQuantity: (value: string) => void;
}

const WasteSection: React.FC<WasteSectionProps> = ({
  wasteType,
  setWasteType,
  wasteQuantity,
  setWasteQuantity
}) => {
  return (
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
  );
};

export default WasteSection;
