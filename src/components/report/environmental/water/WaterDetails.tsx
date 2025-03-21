
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

interface WaterDetailsProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const WaterDetails: React.FC<WaterDetailsProps> = ({ value, onChange }) => {
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
        <Label htmlFor="waterDetails" className="mr-2 font-medium">
          Dettagli sulla gestione dell'acqua
        </Label>
        {renderTooltip(
          "Gestione dell'acqua", 
          "In questa sezione è possibile fornire dettagli sulle pratiche di gestione dell'acqua adottate dall'azienda. Includere informazioni su <strong>strategie di risparmio idrico</strong>, <strong>sistemi di raccolta dell'acqua piovana</strong>, <strong>impianti di trattamento delle acque reflue</strong>, <strong>programmi di riutilizzo dell'acqua</strong>, e altre iniziative per ridurre l'impatto sulle risorse idriche."
        )}
      </div>
      <Textarea 
        id="waterDetails" 
        name="waterDetails" 
        placeholder="Descrivi le pratiche di gestione dell'acqua, le iniziative di risparmio idrico e i progetti per ridurre il consumo idrico" 
        value={value} 
        onChange={onChange} 
        className="min-h-[120px]" 
      />
    </div>
  );
};

export default WaterDetails;
