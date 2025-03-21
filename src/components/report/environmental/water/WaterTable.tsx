
import React from 'react';
import { WaterMetricsData } from '../hooks/water/useWaterMetrics';
import { WaterTableHeader, WaterTableRow } from './components';
import { TooltipRenderer } from '@/components/report/environmental/biodiversity/components';

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
  const tooltipContents = {
    waterWithdrawal: "Il prelievo idrico si riferisce alla quantità di acqua che un'impresa preleva all'interno dei propri confini organizzativi da qualsiasi fonte durante il periodo di riferimento. In pratica, per la maggior parte delle imprese si tratta della quantità di acqua prelevata dalla rete idrica pubblica, come indicato nelle bollette. Tuttavia, laddove applicabile, il prelievo di acqua comprende anche le quantità di acqua prelevate da altre fonti, come l'acqua di falda dai propri pozzi, l'acqua prelevata da fiumi o laghi o l'acqua ricevuta da altre imprese. L'acqua piovana raccolta dall'impresa non è considerata un prelievo idrico.",
    waterConsumption: "Il consumo idrico è la quantità di acqua prelevata all'interno dei confini dell'impresa che non viene scaricata o che si prevede di scaricare nuovamente nell'ambiente idrico o a terzi. Si tratta tipicamente di acqua evaporata - ad esempio, nei processi di energia termica come l'essiccazione o la produzione di energia - di acqua incorporata nei prodotti - ad esempio, nella produzione alimentare - o di acqua per l'irrigazione - ad esempio, utilizzata in agricoltura o per innaffiare i locali dell'impresa. L'acqua piovana raccolta può essere considerata nel calcolo del consumo di acqua, come un input separato dal prelievo di acqua.",
    waterStressAreas: "Il consumo idrico in zone di stress idrico fa riferimento alla quantità di acqua utilizzata dall'impresa in aree geografiche dove vi è una scarsità di acqua dolce disponibile rispetto alla domanda. Queste zone sono caratterizzate da una alta competizione per le risorse idriche disponibili tra diversi settori e utenti. La misurazione di questo indicatore è importante per valutare l'impatto dell'impresa in aree dove l'uso dell'acqua potrebbe avere conseguenze particolarmente significative sull'ambiente e sulle comunità locali."
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <WaterTableHeader />
        <tbody className="divide-y">
          <WaterTableRow
            label="Prelievo idrico totale (m³)"
            tooltipTitle="Prelievo idrico"
            tooltipContent={tooltipContents.waterWithdrawal}
            previousValue={data.previous_water_withdrawal}
            currentValue={data.current_water_withdrawal}
            percentageChange={percentageChanges.waterWithdrawalChange}
            previousFieldName="previous_water_withdrawal"
            currentFieldName="current_water_withdrawal"
            handleChange={handleChange}
          />
          
          <WaterTableRow
            label="Consumo idrico (m³)"
            tooltipTitle="Consumo idrico"
            tooltipContent={tooltipContents.waterConsumption}
            previousValue={data.previous_water_consumption}
            currentValue={data.current_water_consumption}
            percentageChange={percentageChanges.waterConsumptionChange}
            previousFieldName="previous_water_consumption"
            currentFieldName="current_water_consumption"
            handleChange={handleChange}
          />
          
          <WaterTableRow
            label="Consumo idrico in zone di stress idrico (m³)"
            tooltipTitle="Zone di stress idrico"
            tooltipContent={tooltipContents.waterStressAreas}
            previousValue={data.previous_water_stress_areas}
            currentValue={data.current_water_stress_areas}
            percentageChange={percentageChanges.waterStressAreasChange}
            previousFieldName="previous_water_stress_areas"
            currentFieldName="current_water_stress_areas"
            handleChange={handleChange}
            externalLink={{
              url: "https://www.wri.org/applications/aqueduct/water-risk-atlas/#/?advanced=false&basemap=hydro&indicator=w_awr_def_tot_cat&lat=30&lng=-80&mapMode=view&month=1&opacity=0.5&ponderation=DEF&predefined=false&projection=absolute&scenario=optimistic&scope=baseline&threshold&timeScale=annual&year=baseline&zoom=3",
              ariaLabel: "Apri Water Risk Atlas"
            }}
          />
        </tbody>
      </table>
    </div>
  );
};

export default WaterTable;
