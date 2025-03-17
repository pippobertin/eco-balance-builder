
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricChart from '@/components/dashboard/MetricChart';

interface EmissionsChartProps {
  totalScope1Emissions?: number;
  totalScope2Emissions?: number;
  totalScope3Emissions?: number;
}

const EmissionsChart: React.FC<EmissionsChartProps> = ({
  totalScope1Emissions,
  totalScope2Emissions,
  totalScope3Emissions
}) => {
  const navigate = useNavigate();
  
  // Filtra valori undefined e li converte a 0
  const scope1Value = typeof totalScope1Emissions === 'number' ? totalScope1Emissions : 0;
  const scope2Value = typeof totalScope2Emissions === 'number' ? totalScope2Emissions : 0;
  const scope3Value = typeof totalScope3Emissions === 'number' ? totalScope3Emissions : 0;
  
  // Calcola emissioni totali
  const total = scope1Value + scope2Value + scope3Value;

  // Prepara dati per il grafico delle emissioni - anello interno (suddivisione per scope)
  const scopeData = [];
  
  if (scope1Value > 0) {
    scopeData.push({
      name: 'Scope 1',
      value: scope1Value
    });
  }
  
  if (scope2Value > 0) {
    scopeData.push({
      name: 'Scope 2',
      value: scope2Value
    });
  }
  
  if (scope3Value > 0) {
    scopeData.push({
      name: 'Scope 3',
      value: scope3Value
    });
  }

  // Prepara dati per l'anello esterno (emissioni totali)
  const totalData = total > 0 ? [
    {
      name: 'Totale Emissioni',
      value: total
    }
  ] : [];

  // Usa una palette di colori più morbida
  const innerColors = ['#D946EF', '#F97316', '#0EA5E9'];
  const outerColors = ['#8B5CF6'];

  // Controlla se abbiamo dati
  const hasData = scopeData.length > 0;
  
  const handleTitleClick = () => {
    // Naviga alla scheda metriche e specifica sezione e campo
    navigate('/report', { 
      state: { 
        activeTab: 'metrics',
        section: 'environmental', 
        field: 'emissions' 
      } 
    });
  };

  return (
    <MetricChart
      title="Emissioni GHG (B3)"
      description="Emissioni di gas serra per scope e totali"
      type={hasData ? "donut" : "empty"}
      data={hasData ? [
        { ring: 'inner', data: scopeData, colors: innerColors },
        { ring: 'outer', data: totalData, colors: outerColors }
      ] : []}
      dataKey="name"
      hideLegend={false}
      onTitleClick={handleTitleClick}
    />
  );
};

export default EmissionsChart;
