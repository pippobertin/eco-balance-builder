
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
    emissionCalculationLogs,
    waterUsage,
    waterConsumption,
    waterStressAreas,
    landUse,
    impermeableSurface,
    natureSurfaceOnSite,
    natureSurfaceOffSite,
    airPollution,
    waterPollution,
    soilPollution,
    totalWaste,
    recycledWaste,
    hazardousWaste,
    recycledContent,
    recyclableContent
  } = reportData.environmentalMetrics || {};
  
  // Verifichiamo se ci sono dati sulle emissioni per scope
  let hasEmissionsData = false;
  let scope1Value = 0;
  let scope2Value = 0; 
  let scope3Value = 0;
  
  // Tentiamo di calcolare le emissioni dai log di calcolo
  if (emissionCalculationLogs) {
    try {
      const logs = JSON.parse(emissionCalculationLogs);
      scope1Value = logs.scope1Calculations?.reduce((sum: number, calc: any) => sum + (parseFloat(calc.emissions) || 0), 0) || 0;
      scope2Value = logs.scope2Calculations?.reduce((sum: number, calc: any) => sum + (parseFloat(calc.emissions) || 0), 0) || 0;
      scope3Value = logs.scope3Calculations?.reduce((sum: number, calc: any) => sum + (parseFloat(calc.emissions) || 0), 0) || 0;
      
      hasEmissionsData = scope1Value > 0 || scope2Value > 0 || scope3Value > 0;
    } catch (error) {
      console.error("Error parsing calculation logs:", error);
      // Fallback to direct values
      hasEmissionsData = 
        (typeof totalScope1Emissions === 'number' && totalScope1Emissions > 0) ||
        (typeof totalScope2Emissions === 'number' && totalScope2Emissions > 0) ||
        (typeof totalScope3Emissions === 'number' && totalScope3Emissions > 0);
    }
  } else {
    // Check if we have direct emission values
    hasEmissionsData = 
      (typeof totalScope1Emissions === 'number' && totalScope1Emissions > 0) ||
      (typeof totalScope2Emissions === 'number' && totalScope2Emissions > 0) ||
      (typeof totalScope3Emissions === 'number' && totalScope3Emissions > 0);
  }
  
  // Creiamo la struttura dati per il grafico
  const environmentalData = [
    ...(scope1Value > 0 || (typeof totalScope1Emissions === 'number' && totalScope1Emissions > 0) ? [{ 
      metric: 'Emissioni Scope 1', 
      value: scope1Value > 0 ? scope1Value : totalScope1Emissions,
      color: '#FF3B30' // Rosso
    }] : []),
    ...(scope2Value > 0 || (typeof totalScope2Emissions === 'number' && totalScope2Emissions > 0) ? [{ 
      metric: 'Emissioni Scope 2', 
      value: scope2Value > 0 ? scope2Value : totalScope2Emissions,
      color: '#FF9500' // Arancione
    }] : []),
    ...(scope3Value > 0 || (typeof totalScope3Emissions === 'number' && totalScope3Emissions > 0) ? [{ 
      metric: 'Emissioni Scope 3', 
      value: scope3Value > 0 ? scope3Value : totalScope3Emissions,
      color: '#FFCC00' // Giallo
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
    ...(typeof airPollution === 'number' && airPollution > 0 ? [{ 
      metric: 'Inquinamento Aria', 
      value: airPollution,
      color: '#8E8E93' // Grigio
    }] : []),
    ...(typeof waterPollution === 'number' && waterPollution > 0 ? [{ 
      metric: 'Inquinamento Acqua', 
      value: waterPollution,
      color: '#34C759' // Verde
    }] : [])
  ];
  
  // Controlliamo se ci sono dati da visualizzare
  const hasEnvironmentalData = environmentalData.length > 0;
  
  // Se non ci sono dati specifici, ma ci sono emissioni, creiamo un grafico di confronto
  if (!hasEnvironmentalData && hasEmissionsData) {
    const totalEmissionsData = [
      { 
        metric: 'Scope 1', 
        value: scope1Value > 0 ? scope1Value : (totalScope1Emissions || 0),
        color: '#FF3B30' // Rosso
      },
      { 
        metric: 'Scope 2', 
        value: scope2Value > 0 ? scope2Value : (totalScope2Emissions || 0),
        color: '#FF9500' // Arancione
      },
      { 
        metric: 'Scope 3', 
        value: scope3Value > 0 ? scope3Value : (totalScope3Emissions || 0),
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
