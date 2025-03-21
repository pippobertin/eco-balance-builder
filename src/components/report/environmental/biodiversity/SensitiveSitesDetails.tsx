
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface SensitiveSitesDetailsProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SensitiveSitesDetails: React.FC<SensitiveSitesDetailsProps> = ({ value, onChange }) => {
  const renderTooltip = (title: string, content: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 p-0">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Info about {title}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          align="start" 
          className="max-w-md p-4 z-50"
          avoidCollisions={true}
          collisionBoundary={null}
          sticky="always"
        >
          <div className="space-y-2">
            <p className="font-medium text-sm"><strong>{title}</strong></p>
            <p className="text-xs">{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="mt-6">
      <div className="flex items-center">
        <Label htmlFor="sensitiveSitesDetails" className="mr-2 font-medium">
          Numero e area (ha) dei siti in prossimità di aree sensibili
        </Label>
        {renderTooltip(
          "Aree Sensibili Sotto il Profilo della Biodiversità", 
          "Sono aree geografiche riconosciute a livello internazionale o europeo come particolarmente importanti per la conservazione della biodiversità. Include <strong>Rete Natura 2000</strong>, <strong>Siti del Patrimonio Mondiale UNESCO</strong>, <strong>Key Biodiversity Areas (KBA)</strong> e altre aree protette. '<strong>In prossimità</strong>' significa che il sito operativo dell'azienda si trova in parte all'interno di un'area sensibile o confina direttamente con essa."
        )}
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
