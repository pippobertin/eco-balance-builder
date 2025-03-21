
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
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
  const renderTooltip = (title: string, content: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
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
            <p className="font-medium text-sm">{title}</p>
            <p className="text-xs">{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const renderPercentageChange = (change: number | null) => {
    if (change === null) return null;
    
    const isPositive = change > 0;
    const isNegative = change < 0;
    const color = isNegative ? 'text-green-600' : isPositive ? 'text-red-600' : 'text-gray-600';
    const sign = isPositive ? '+' : '';
    
    return (
      <span className={`text-xs font-medium ${color}`}>
        {sign}{change.toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left font-medium text-sm text-gray-600">Metrica</th>
            <th className="p-2 text-right font-medium text-sm text-gray-600">Anno Precedente</th>
            <th className="p-2 text-right font-medium text-sm text-gray-600">Anno Corrente</th>
            <th className="p-2 text-right font-medium text-sm text-gray-600">Variazione %</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {/* Water Withdrawal */}
          <tr className="hover:bg-gray-50">
            <td className="p-2 flex items-center">
              <span className="font-medium text-sm">Prelievo idrico totale (m³)</span>
              {renderTooltip(
                "Prelievo idrico", 
                "Il prelievo idrico si riferisce alla quantità di acqua che un'impresa preleva all'interno dei propri confini organizzativi da qualsiasi fonte durante il periodo di riferimento. In pratica, per la maggior parte delle imprese si tratta della quantità di acqua prelevata dalla rete idrica pubblica, come indicato nelle bollette. Tuttavia, laddove applicabile, il prelievo di acqua comprende anche le quantità di acqua prelevate da altre fonti, come l'acqua di falda dai propri pozzi, l'acqua prelevata da fiumi o laghi o l'acqua ricevuta da altre imprese. L'acqua piovana raccolta dall'impresa non è considerata un prelievo idrico."
              )}
            </td>
            <td className="p-2">
              <Input
                type="number"
                name="previousWaterWithdrawal"
                value={data.previousWaterWithdrawal === null ? '' : data.previousWaterWithdrawal}
                onChange={handleChange}
                className="text-right"
                placeholder="0"
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                name="currentWaterWithdrawal"
                value={data.currentWaterWithdrawal === null ? '' : data.currentWaterWithdrawal}
                onChange={handleChange}
                className="text-right"
                placeholder="0"
              />
            </td>
            <td className="p-2 text-right">
              {renderPercentageChange(percentageChanges.waterWithdrawalChange)}
            </td>
          </tr>
          
          {/* Water Consumption */}
          <tr className="hover:bg-gray-50">
            <td className="p-2 flex items-center">
              <span className="font-medium text-sm">Consumo idrico (m³)</span>
              {renderTooltip(
                "Consumo idrico", 
                "Il consumo idrico è la quantità di acqua prelevata all'interno dei confini dell'impresa che non viene scaricata o che si prevede di scaricare nuovamente nell'ambiente idrico o a terzi. Si tratta tipicamente di acqua evaporata - ad esempio, nei processi di energia termica come l'essiccazione o la produzione di energia - di acqua incorporata nei prodotti - ad esempio, nella produzione alimentare - o di acqua per l'irrigazione - ad esempio, utilizzata in agricoltura o per innaffiare i locali dell'impresa. L'acqua piovana raccolta può essere considerata nel calcolo del consumo di acqua, come un input separato dal prelievo di acqua."
              )}
            </td>
            <td className="p-2">
              <Input
                type="number"
                name="previousWaterConsumption"
                value={data.previousWaterConsumption === null ? '' : data.previousWaterConsumption}
                onChange={handleChange}
                className="text-right"
                placeholder="0"
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                name="currentWaterConsumption"
                value={data.currentWaterConsumption === null ? '' : data.currentWaterConsumption}
                onChange={handleChange}
                className="text-right"
                placeholder="0"
              />
            </td>
            <td className="p-2 text-right">
              {renderPercentageChange(percentageChanges.waterConsumptionChange)}
            </td>
          </tr>
          
          {/* Water Stress Areas */}
          <tr className="hover:bg-gray-50">
            <td className="p-2 flex items-center">
              <span className="font-medium text-sm">Consumo idrico in zone di stress idrico (m³)</span>
              {renderTooltip(
                "Zone di stress idrico", 
                "Il consumo idrico in zone di stress idrico fa riferimento alla quantità di acqua utilizzata dall'impresa in aree geografiche dove vi è una scarsità di acqua dolce disponibile rispetto alla domanda. Queste zone sono caratterizzate da una alta competizione per le risorse idriche disponibili tra diversi settori e utenti. La misurazione di questo indicatore è importante per valutare l'impatto dell'impresa in aree dove l'uso dell'acqua potrebbe avere conseguenze particolarmente significative sull'ambiente e sulle comunità locali."
              )}
            </td>
            <td className="p-2">
              <Input
                type="number"
                name="previousWaterStressAreas"
                value={data.previousWaterStressAreas === null ? '' : data.previousWaterStressAreas}
                onChange={handleChange}
                className="text-right"
                placeholder="0"
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                name="currentWaterStressAreas"
                value={data.currentWaterStressAreas === null ? '' : data.currentWaterStressAreas}
                onChange={handleChange}
                className="text-right"
                placeholder="0"
              />
            </td>
            <td className="p-2 text-right">
              {renderPercentageChange(percentageChanges.waterStressAreasChange)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WaterTable;
