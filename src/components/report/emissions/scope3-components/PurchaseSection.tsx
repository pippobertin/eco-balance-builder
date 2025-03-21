
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
import { Textarea } from "@/components/ui/textarea";
import { PurchaseType } from '@/lib/emissions-types';

interface PurchaseSectionProps {
  purchaseType: PurchaseType;
  setPurchaseType: (value: PurchaseType) => void;
  purchaseQuantity: string;
  setPurchaseQuantity: (value: string) => void;
  purchaseDescription: string;
  setPurchaseDescription: (value: string) => void;
}

const PurchaseSection: React.FC<PurchaseSectionProps> = ({
  purchaseType,
  setPurchaseType,
  purchaseQuantity,
  setPurchaseQuantity,
  purchaseDescription,
  setPurchaseDescription
}) => {
  return (
    <div className="space-y-4">
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
            className="bg-blue-50"
          />
        </div>
      </div>
      
      <div>
        <Label>Descrizione dell'acquisto</Label>
        <Textarea
          value={purchaseDescription}
          onChange={(e) => setPurchaseDescription(e.target.value)}
          placeholder={purchaseType === 'PURCHASED_GOODS' ? "Descrivi il tipo di bene acquistato" : "Descrivi il tipo di servizio acquistato"}
          className="bg-white"
        />
      </div>
    </div>
  );
};

export default PurchaseSection;
