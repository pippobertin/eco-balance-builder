
import React from 'react';

export const renderEmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
    <p className="text-lg font-medium mb-2">Nessun dato disponibile</p>
    <p className="text-sm text-gray-400">Non sono presenti dati per questo grafico</p>
  </div>
);

export const createDefaultTooltip = ({ active, payload, label }: any, tooltipFormatter?: (value: number, name: string, entry: any) => React.ReactNode) => {
  if (active && payload && payload.length) {
    if (tooltipFormatter && payload[0]) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          {tooltipFormatter(payload[0].value, payload[0].name, payload[0])}
        </div>
      );
    }
    
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const hasValidData = (data: any[], categories: string[] = ['value']) => {
  return data.some(item => 
    categories.some(category => 
      typeof item[category] === 'number' && item[category] > 0
    )
  );
};
