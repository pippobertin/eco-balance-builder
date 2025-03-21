
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TooltipRenderer } from './components';

interface SensitiveSitesDetailsProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SensitiveSitesDetails: React.FC<SensitiveSitesDetailsProps> = ({ value, onChange }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center">
        <Label htmlFor="sensitiveSitesDetails" className="mr-2 font-medium">
          Numero e area (ha) dei siti in prossimità di aree sensibili
        </Label>
        <TooltipRenderer
          title="Aree Sensibili Sotto il Profilo della Biodiversità"
          content="Sono aree geografiche riconosciute a livello internazionale o europeo come particolarmente importanti per la conservazione della biodiversità. Include Rete Natura 2000, Siti del Patrimonio Mondiale UNESCO, Key Biodiversity Areas (KBA) e altre aree protette. 'In prossimità' significa che il sito operativo dell'azienda si trova in parte all'interno di un'area sensibile o confina direttamente con essa."
        />
      </div>
      <Textarea 
        id="sensitiveSitesDetails" 
        name="sensitiveSitesDetails" 
        placeholder="Descrivi i siti di proprietà, affittati o gestiti all'interno o in prossimità di aree sensibili sotto il profilo della biodiversità" 
        value={value} 
        onChange={onChange} 
        className="min-h-[120px]" 
      />
    </div>
  );
};

export default SensitiveSitesDetails;
