
import React from 'react';
import { Input } from "@/components/ui/input";
import { HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { BiodiversityLandUseData } from '../hooks/biodiversity/useBiodiversityLandUse';

interface BiodiversityTableProps {
  data: BiodiversityLandUseData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  percentageChanges: {
    totalLandUseChange: number | null;
    impermeableSurfaceChange: number | null;
    natureSurfaceOnsiteChange: number | null;
    natureSurfaceOffsiteChange: number | null;
  };
}

const BiodiversityTable: React.FC<BiodiversityTableProps> = ({
  data,
  handleChange,
  percentageChanges
}) => {
  // Format percentage change with sign and decimals
  const formatPercentage = (value: number | null) => {
    if (value === null) return '-';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Metrica</th>
            <th className="border p-2 text-center">Anno precedente</th>
            <th className="border p-2 text-center">Anno corrente</th>
            <th className="border p-2 text-center">Variazione %</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 flex items-center">
              <span className="font-medium">Uso totale del suolo</span>
              {renderTooltip(
                "Uso totale del suolo", 
                "La superficie totale di terreno utilizzata dall'azienda per le sue attività, espressa in ettari (ha)."
              )}
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="previousTotalLandUse" 
                value={data.previousTotalLandUse ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="currentTotalLandUse" 
                value={data.currentTotalLandUse ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2 text-center">
              {formatPercentage(percentageChanges.totalLandUseChange)}
            </td>
          </tr>
          <tr>
            <td className="border p-2 flex items-center">
              <span className="font-medium">Superficie impermeabilizzata</span>
              {renderTooltip(
                "Superficie impermeabilizzata", 
                "Si riferisce all'area di terreno coperta da materiali impermeabili, che impediscono all'acqua piovana di infiltrarsi nel suolo naturale. Include <strong>edifici</strong>, <strong>superfici esterne</strong>, <strong>strade e parcheggi asfaltati o cementati</strong>, <strong>piazzali industriali pavimentati</strong>, <strong>marciapiedi e sentieri pavimentati</strong>."
              )}
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="previousImpermeableSurface" 
                value={data.previousImpermeableSurface ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="currentImpermeableSurface" 
                value={data.currentImpermeableSurface ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2 text-center">
              {formatPercentage(percentageChanges.impermeableSurfaceChange)}
            </td>
          </tr>
          <tr>
            <td className="border p-2 flex items-center">
              <span className="font-medium">Superficie orientata alla natura in sito</span>
              {renderTooltip(
                "Superficie orientata alla natura in sito", 
                "Si riferisce a porzioni di terreno all'interno del sito operativo dell'azienda gestite o create per favorire la biodiversità e gli ecosistemi naturali. Esempi includono <strong>giardini naturalistici</strong> con piante autoctone, <strong>stagni o zone umide artificiali</strong>, <strong>boschetti o aree boscate</strong>, <strong>tetti verdi</strong>, <strong>fasce tampone vegetate</strong>."
              )}
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="previousNatureSurfaceOnsite" 
                value={data.previousNatureSurfaceOnsite ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="currentNatureSurfaceOnsite" 
                value={data.currentNatureSurfaceOnsite ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2 text-center">
              {formatPercentage(percentageChanges.natureSurfaceOnsiteChange)}
            </td>
          </tr>
          <tr>
            <td className="border p-2 flex items-center">
              <span className="font-medium">Superficie orientata alla natura fuori sito</span>
              {renderTooltip(
                "Superficie orientata alla natura fuori sito", 
                "Si riferisce ad azioni o progetti di conservazione e ripristino della biodiversità realizzati dall'azienda al di fuori del suo sito operativo. Esempi includono <strong>progetti di riforestazione</strong> o ripristino di habitat, <strong>creazione o gestione di riserve naturali</strong>, <strong>progetti di conservazione di specie minacciate</strong>, <strong>corridoi ecologici</strong>."
              )}
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="previousNatureSurfaceOffsite" 
                value={data.previousNatureSurfaceOffsite ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="currentNatureSurfaceOffsite" 
                value={data.currentNatureSurfaceOffsite ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2 text-center">
              {formatPercentage(percentageChanges.natureSurfaceOffsiteChange)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BiodiversityTable;
