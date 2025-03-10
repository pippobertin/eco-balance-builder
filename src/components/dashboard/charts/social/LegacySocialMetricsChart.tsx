
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/types';
import { Info } from 'lucide-react';

type ChartType = 'area' | 'bar' | 'pie' | 'empty';

interface LegacySocialMetricsChartProps {
  reportData: ReportData;
}

const LegacySocialMetricsChart: React.FC<LegacySocialMetricsChartProps> = ({ reportData }) => {
  // Check for legacy social data and ensure it's properly parsed as numbers
  const employeeDiversity = reportData.socialMetrics?.employeeDiversity;
  const employeeSatisfaction = reportData.socialMetrics?.employeeSatisfaction;
  const trainingHours = reportData.socialMetrics?.trainingHours;
  const communityEngagement = reportData.socialMetrics?.communityEngagement;
  
  const diversityValue = typeof employeeDiversity === 'string' ? parseFloat(employeeDiversity) || 0 : (employeeDiversity || 0);
  const satisfactionValue = typeof employeeSatisfaction === 'string' ? parseFloat(employeeSatisfaction) || 0 : (employeeSatisfaction || 0);
  const trainingValue = typeof trainingHours === 'string' ? parseFloat(trainingHours) || 0 : (trainingHours || 0);
  const engagementValue = typeof communityEngagement === 'string' ? parseFloat(communityEngagement) || 0 : (communityEngagement || 0);
  
  const hasLegacySocialData = diversityValue > 0 || satisfactionValue > 0 || trainingValue > 0 || engagementValue > 0;
  
  let chartData = [];
  // Explicitly type chartType
  const chartType: ChartType = hasLegacySocialData ? 'bar' : 'empty';
  
  if (hasLegacySocialData) {
    chartData = [
      { name: 'Diversità di Genere', value: diversityValue },
      { name: 'Soddisfazione Dipendenti', value: satisfactionValue },
      { name: 'Ore di Formazione', value: trainingValue },
      { name: 'Impegno Comunitario', value: engagementValue }
    ].filter(item => item.value > 0);
  }
  
  console.log("Legacy social chart data:", { hasLegacySocialData, chartData, diversityValue, satisfactionValue, trainingValue, engagementValue });
  
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
