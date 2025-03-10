
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/types';
import { Info } from 'lucide-react';

type ChartType = 'area' | 'bar' | 'pie' | 'empty';

interface LegacySocialMetricsChartProps {
  reportData: ReportData;
}

const LegacySocialMetricsChart: React.FC<LegacySocialMetricsChartProps> = ({ reportData }) => {
  const hasLegacySocialData = 
    reportData.socialMetrics && 
    ((typeof reportData.socialMetrics.employeeDiversity === 'number' && reportData.socialMetrics.employeeDiversity > 0) || 
     (typeof reportData.socialMetrics.employeeSatisfaction === 'number' && reportData.socialMetrics.employeeSatisfaction > 0) || 
     (typeof reportData.socialMetrics.trainingHours === 'number' && reportData.socialMetrics.trainingHours > 0) || 
     (typeof reportData.socialMetrics.communityEngagement === 'number' && reportData.socialMetrics.communityEngagement > 0));
  
  let chartData = [];
  // Explicitly type chartType
  const chartType: ChartType = hasLegacySocialData ? 'bar' : 'empty';
  
  if (hasLegacySocialData) {
    chartData = [
      { 
        name: 'Diversità di Genere', 
        value: reportData.socialMetrics && typeof reportData.socialMetrics.employeeDiversity === 'number' 
          ? reportData.socialMetrics.employeeDiversity 
          : 0 
      },
      { 
        name: 'Soddisfazione Dipendenti', 
        value: reportData.socialMetrics && typeof reportData.socialMetrics.employeeSatisfaction === 'number'
          ? reportData.socialMetrics.employeeSatisfaction 
          : 0 
      },
      { 
        name: 'Ore di Formazione', 
        value: reportData.socialMetrics && typeof reportData.socialMetrics.trainingHours === 'number'
          ? reportData.socialMetrics.trainingHours 
          : 0 
      },
      { 
        name: 'Impegno Comunitario', 
        value: reportData.socialMetrics && typeof reportData.socialMetrics.communityEngagement === 'number'
          ? reportData.socialMetrics.communityEngagement 
          : 0
      }
    ];
  }
  
  // Custom tooltip formatter for legacy metrics
  const legacyTooltipFormatter = (value: number, name: string) => {
    let description = '';
    switch(name) {
      case 'Diversità di Genere':
        description = 'Indice di diversità nella forza lavoro (scala 0-100)';
        break;
      case 'Soddisfazione Dipendenti':
        description = 'Livello di soddisfazione dei dipendenti (scala 0-100)';
        break;
      case 'Ore di Formazione':
        description = 'Ore medie di formazione per dipendente all\'anno';
        break;
      case 'Impegno Comunitario':
        description = 'Indice di impegno nella comunità locale (scala 0-100)';
        break;
    }
    
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium">{value} {name === 'Ore di Formazione' ? 'ore' : 'punti'}</p>
        <p className="text-xs text-gray-500">{description}</p>
        <div className="flex items-center text-xs text-amber-600 gap-1 mt-1">
          <Info size={12} />
          <span>Metrica sociale</span>
        </div>
      </div>
    );
  };
  
  return (
    <MetricChart
      title="Diversità del Personale"
      description={hasLegacySocialData ? 
        "Metriche sociali generali" : 
        "Nessun dato di diversità disponibile"}
      type={chartType}
      data={chartData}
      dataKey="name"
      categories={['value']}
      colors={['#FF9500']}
      height={300}
      tooltipFormatter={legacyTooltipFormatter}
    />
  );
};

export default LegacySocialMetricsChart;
