
import React from 'react';
import { ReportData } from '@/context/types';
import { Leaf } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';

interface EnvironmentalSectionProps {
  reportData: ReportData;
  companyName?: string;
}

const EnvironmentalSection: React.FC<EnvironmentalSectionProps> = ({ reportData, companyName }) => {
  const {
    totalScope1Emissions,
    totalScope2Emissions,
    totalScope3Emissions,
    carbonEmissions,
    energyConsumption,
    wasteGeneration,
    waterUsage,
    renewableEnergy
  } = reportData.environmentalMetrics || {};
  
  // Prepara i dati per i grafici basati sui campi dell'informativa B3-B7
  
  // B3: Emissioni GHG
  const emissionsData = [];
  if (totalScope1Emissions || totalScope2Emissions || totalScope3Emissions) {
    emissionsData.push({
      name: 'Scope 1',
      value: typeof totalScope1Emissions === 'number' ? totalScope1Emissions : 0
    });
    emissionsData.push({
      name: 'Scope 2',
      value: typeof totalScope2Emissions === 'number' ? totalScope2Emissions : 0
    });
    emissionsData.push({
      name: 'Scope 3',
      value: typeof totalScope3Emissions === 'number' ? totalScope3Emissions : 0
    });
  }
  
  // B4: Consumo energetico
  const energyData = [];
  if (energyConsumption) {
    energyData.push({
      name: 'Consumo Totale',
      value: typeof energyConsumption === 'number' ? energyConsumption : 0
    });
  }
  
  if (renewableEnergy) {
    energyData.push({
      name: 'Energia Rinnovabile',
      value: typeof renewableEnergy === 'number' ? renewableEnergy : 0
    });
  }
  
  // B5-B7: Acqua e rifiuti
  const resourceData = [];
  if (waterUsage) {
    resourceData.push({
      name: 'Utilizzo Acqua',
      value: typeof waterUsage === 'number' ? waterUsage : 0
    });
  }
  
  if (wasteGeneration) {
    resourceData.push({
      name: 'Generazione Rifiuti',
      value: typeof wasteGeneration === 'number' ? wasteGeneration : 0
    });
  }
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="h-6 w-6 text-green-500" />
        <h2 className="text-xl font-bold text-gray-900">
          Performance Ambientale
          {companyName && <span className="text-green-500 ml-2">({companyName})</span>}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* B3: Grafico emissioni GHG - Colori aggiornati per Scope 1, 2, 3 */}
        <MetricChart
          title="Emissioni GHG (B3)"
          description="Suddivisione delle emissioni di gas serra per scope"
          type={emissionsData.length > 0 ? "bar" : "empty"}
          data={emissionsData}
          dataKey="name"
          categories={["value"]}
          colors={["#8B5CF6", "#D946EF", "#F97316"]} {/* Viola, Magenta, Arancione */}
        />
        
        {/* B4: Grafico consumi energetici */}
        <MetricChart
          title="Consumo Energetico (B4)"
          description="Consumo energetico totale e fonti rinnovabili"
          type={energyData.length > 0 ? "bar" : "empty"}
          data={energyData}
          dataKey="name"
          categories={["value"]}
          colors={["#FF3B30", "#34C759"]}
        />
        
        {/* B5-B7: Grafico acqua e rifiuti */}
        <MetricChart
          title="Acqua e Rifiuti (B5-B7)"
          description="Utilizzo di acqua e generazione di rifiuti"
          type={resourceData.length > 0 ? "bar" : "empty"}
          data={resourceData}
          dataKey="name"
          categories={["value"]}
          colors={["#5AC8FA", "#FF9500"]}
        />
      </div>
    </div>
  );
};

export default EnvironmentalSection;
