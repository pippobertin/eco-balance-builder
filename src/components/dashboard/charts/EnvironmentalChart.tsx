
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/types';

interface EnvironmentalChartProps {
  reportData: ReportData;
}

const EnvironmentalChart: React.FC<EnvironmentalChartProps> = ({ reportData }) => {
  // Estraiamo tutti i dati ambientali rilevanti, incluse le emissioni per scope
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
  
  // Verifichiamo se ci sono dati sulle emissioni per scope
  const hasScope1 = typeof totalScope1Emissions === 'number' && totalScope1Emissions > 0;
  const hasScope2 = typeof totalScope2Emissions === 'number' && totalScope2Emissions > 0;
  const hasScope3 = typeof totalScope3Emissions === 'number' && totalScope3Emissions > 0;
  
  // Creiamo la struttura dati per il grafico
  const environmentalData = [
    ...(hasScope1 ? [{ 
      metric: 'Emissioni Scope 1', 
      value: totalScope1Emissions,
      color: '#FF3B30' // Rosso
    }] : []),
    ...(hasScope2 ? [{ 
      metric: 'Emissioni Scope 2', 
      value: totalScope2Emissions,
      color: '#FF9500' // Arancione
    }] : []),
    ...(hasScope3 ? [{ 
      metric: 'Emissioni Scope 3', 
      value: totalScope3Emissions,
      color: '#FFCC00' // Giallo
    }] : []),
    ...(typeof energyConsumption === 'number' && energyConsumption > 0 ? [{ 
      metric: 'Consumo Energia', 
      value: energyConsumption,
      color: '#5AC8FA' // Blu
    }] : []),
    ...(typeof waterUsage === 'number' && waterUsage > 0 ? [{ 
      metric: 'Consumo Acqua', 
      value: waterUsage,
      color: '#4CD964' // Verde
    }] : []),
    ...(typeof wasteGeneration === 'number' && wasteGeneration > 0 ? [{ 
      metric: 'Generazione Rifiuti', 
      value: wasteGeneration,
      color: '#8E8E93' // Grigio
    }] : []),
    ...(typeof renewableEnergy === 'number' && renewableEnergy > 0 ? [{ 
      metric: 'Energia Rinnovabile', 
      value: renewableEnergy,
      color: '#34C759' // Verde
    }] : [])
  ];
  
  // Controlliamo se ci sono dati da visualizzare
  const hasEnvironmentalData = environmentalData.length > 0;
  
  // Se non ci sono dati specifici, ma ci sono emissioni totali, creiamo un grafico di confronto
  if (!hasEnvironmentalData && (hasScope1 || hasScope2 || hasScope3)) {
    const totalEmissionsData = [
      { 
        metric: 'Scope 1', 
        value: hasScope1 ? totalScope1Emissions : 0,
        color: '#FF3B30' // Rosso
      },
      { 
        metric: 'Scope 2', 
        value: hasScope2 ? totalScope2Emissions : 0,
        color: '#FF9500' // Arancione
      },
      { 
        metric: 'Scope 3', 
        value: hasScope3 ? totalScope3Emissions : 0,
        color: '#FFCC00' // Giallo
      }
    ].filter(item => item.value > 0);
    
    // Prepariamo i dati per il grafico a torta
    const pieChartData = totalEmissionsData.map(item => ({
      name: item.metric,
      value: item.value
    }));
    
    return (
      <MetricChart
        title="Performance Ambientale"
        description="Distribuzione delle emissioni di CO₂ per scope"
        type="pie"
        data={pieChartData}
        dataKey="name"
        categories={totalEmissionsData.map(item => item.metric)}
        colors={totalEmissionsData.map(item => item.color)}
        height={300}
      />
    );
  }
  
  // Prepariamo i dati per il grafico a barre
  const barChartData = hasEnvironmentalData ? 
    [{
      name: 'Metriche Ambientali',
      ...environmentalData.reduce((acc, item) => {
        acc[item.metric] = item.value;
        return acc;
      }, {})
    }] : [];
  
  // Otteniamo categorie e colori per il grafico
  const categories = environmentalData.map(item => item.metric);
  const colors = environmentalData.map(item => item.color);
  
  return (
    <MetricChart
      title="Performance Ambientale"
      description={hasEnvironmentalData ? 
        "Indicatori ambientali chiave" : 
        "Nessun dato ambientale disponibile"}
      type={hasEnvironmentalData ? "bar" : "empty"}
      data={barChartData}
      dataKey="name"
      categories={categories}
      colors={colors}
      height={300}
    />
  );
};

export default EnvironmentalChart;
