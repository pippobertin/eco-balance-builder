
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
import { WaterMetricsData } from '../hooks/water/useWaterMetrics';

interface WaterTableProps {
  data: WaterMetricsData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  percentageChanges: {
    waterWithdrawalChange: number | null;
    waterConsumptionChange: number | null;
    waterStressAreasChange: number | null;
  };
}

const WaterTable: React.FC<WaterTableProps> = ({
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
              <span className="font-medium">Prelievo idrico totale</span>
              {renderTooltip(
                "Prelievo idrico", 
                "Il prelievo idrico si riferisce alla quantità di acqua che un'impresa preleva all'interno dei propri confini organizzativi da qualsiasi fonte durante il periodo di riferimento. Include <strong>acqua prelevata dalla rete idrica pubblica</strong>, <strong>acqua di falda dai propri pozzi</strong>, <strong>acqua prelevata da fiumi o laghi</strong>, e <strong>acqua ricevuta da altre imprese</strong>. L'acqua piovana raccolta dall'impresa non è considerata un prelievo idrico."
              )}
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="previousWaterWithdrawal" 
                value={data.previousWaterWithdrawal ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="currentWaterWithdrawal" 
                value={data.currentWaterWithdrawal ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2 text-center">
              {formatPercentage(percentageChanges.waterWithdrawalChange)}
            </td>
          </tr>
          <tr>
            <td className="border p-2 flex items-center">
              <span className="font-medium">Consumo idrico</span>
              {renderTooltip(
                "Consumo idrico", 
                "Il consumo idrico è la quantità di acqua prelevata all'interno dei confini dell'impresa che non viene scaricata o che si prevede di scaricare nuovamente nell'ambiente idrico o a terzi. Include <strong>acqua evaporata</strong> nei processi di energia termica come l'essiccazione o la produzione di energia, <strong>acqua incorporata nei prodotti</strong> nella produzione alimentare, o <strong>acqua per l'irrigazione</strong> utilizzata in agricoltura o per innaffiare i locali dell'impresa. Formula: <strong>Consumo di acqua = Acqua [prelievo + raccolta di acqua piovana - scarichi]</strong>."
              )}
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="previousWaterConsumption" 
                value={data.previousWaterConsumption ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="currentWaterConsumption" 
                value={data.currentWaterConsumption ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2 text-center">
              {formatPercentage(percentageChanges.waterConsumptionChange)}
            </td>
          </tr>
          <tr>
            <td className="border p-2 flex items-center">
              <span className="font-medium">Prelievo idrico in aree a stress idrico</span>
              {renderTooltip(
                "Prelievo in aree a stress idrico", 
                "Si riferisce alla quantità di acqua prelevata da fonti situate in aree geografiche dove la domanda di acqua supera la disponibilità durante almeno parte dell'anno. Queste aree sono caratterizzate da <strong>scarsità di acqua</strong>, <strong>degrado della qualità dell'acqua</strong>, o <strong>accesso limitato all'acqua potabile</strong>. È importante monitorare questo dato per valutare l'impatto dell'azienda sulle risorse idriche nelle aree vulnerabili."
              )}
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="previousWaterStressAreas" 
                value={data.previousWaterStressAreas ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2">
              <Input 
                type="number" 
                name="currentWaterStressAreas" 
                value={data.currentWaterStressAreas ?? ''} 
                onChange={handleChange} 
                step="0.01"
                className="text-center"
              />
            </td>
            <td className="border p-2 text-center">
              {formatPercentage(percentageChanges.waterStressAreasChange)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WaterTable;
