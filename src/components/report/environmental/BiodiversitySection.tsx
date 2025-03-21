
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Leaf, Info, Save, HelpCircle } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useReport } from '@/hooks/use-report-context';
import { useBiodiversityLandUse } from './hooks/biodiversity';
import AutoSaveIndicator from '../AutoSaveIndicator';

interface BiodiversitySectionProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

const BiodiversitySection: React.FC<BiodiversitySectionProps> = ({
  formValues,
  setFormValues
}) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  
  const { 
    data, 
    isLoading, 
    isSaving, 
    saveData, 
    updateField,
    percentageChanges,
    lastSaved
  } = useBiodiversityLandUse({ reportId });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Standard input handler for global state
    if (typeof setFormValues === 'function' && setFormValues.length === 1) {
      setFormValues(e);
    } else {
      const { name, value } = e.target;
      (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => ({
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          [name]: value
        }
      }));
    }
  };

  // Handler for local state (biodiversity specific fields)
  const handleBiodiversityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numValue = name !== 'sensitiveSitesDetails' && name !== 'areaUnit' 
      ? value === '' ? null : parseFloat(value)
      : value;
    
    updateField(name as keyof typeof data, numValue);
  };

  const handleSaveData = async () => {
    if (await saveData(data)) {
      // Also update the global form state with the biodiversity data
      if (typeof setFormValues !== 'function' || setFormValues.length !== 1) {
        (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => ({
          ...prev,
          environmentalMetrics: {
            ...prev.environmentalMetrics,
            biodiversityDetails: data.sensitiveSitesDetails
          }
        }));
      }
    }
  };

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
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <Leaf className="mr-2 h-5 w-5 text-emerald-500" />
        <h3 className="text-xl font-semibold">B5 - Biodiversità e ecosistemi</h3>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 rounded-md mb-4 bg-emerald-100">
          <div className="flex items-start">
            <Info className="mt-0.5 mr-2 h-4 w-4 text-emerald-600" />
            <p className="text-sm text-slate-600">
              Indica i dati relativi agli impatti sulla biodiversità, sugli ecosistemi e sull'uso del suolo. I dati sono espressi in ettari (ha).
            </p>
          </div>
        </div>
        
        {!reportId && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Per registrare i dati sulla biodiversità è necessario prima salvare il report.
            </AlertDescription>
          </Alert>
        )}

        {lastSaved && (
          <AutoSaveIndicator 
            needsSaving={Boolean(isSaving)} 
            lastSaved={lastSaved} 
            className="mb-4" 
          />
        )}

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
                    onChange={handleBiodiversityChange} 
                    step="0.01"
                    className="text-center"
                  />
                </td>
                <td className="border p-2">
                  <Input 
                    type="number" 
                    name="currentTotalLandUse" 
                    value={data.currentTotalLandUse ?? ''} 
                    onChange={handleBiodiversityChange} 
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
                    onChange={handleBiodiversityChange} 
                    step="0.01"
                    className="text-center"
                  />
                </td>
                <td className="border p-2">
                  <Input 
                    type="number" 
                    name="currentImpermeableSurface" 
                    value={data.currentImpermeableSurface ?? ''} 
                    onChange={handleBiodiversityChange} 
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
                    onChange={handleBiodiversityChange} 
                    step="0.01"
                    className="text-center"
                  />
                </td>
                <td className="border p-2">
                  <Input 
                    type="number" 
                    name="currentNatureSurfaceOnsite" 
                    value={data.currentNatureSurfaceOnsite ?? ''} 
                    onChange={handleBiodiversityChange} 
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
                    onChange={handleBiodiversityChange} 
                    step="0.01"
                    className="text-center"
                  />
                </td>
                <td className="border p-2">
                  <Input 
                    type="number" 
                    name="currentNatureSurfaceOffsite" 
                    value={data.currentNatureSurfaceOffsite ?? ''} 
                    onChange={handleBiodiversityChange} 
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
            value={data.sensitiveSitesDetails} 
            onChange={handleBiodiversityChange} 
            className="min-h-[120px]" 
          />
        </div>

        <Button 
          onClick={handleSaveData} 
          disabled={isSaving}
          className="flex items-center"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Salvataggio in corso..." : "Salva dati biodiversità"}
        </Button>
      </div>
    </GlassmorphicCard>
  );
};

export default BiodiversitySection;
