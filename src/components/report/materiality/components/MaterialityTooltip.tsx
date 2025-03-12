
import React from 'react';
import { categoryColors } from '../utils/esgCategoryUtils';

interface MaterialityTooltipProps {
  active?: boolean;
  payload?: any[];
}

const MaterialityTooltip: React.FC<MaterialityTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const categoryColor = categoryColors[data.category as keyof typeof categoryColors];
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
        <h4 className="font-semibold text-gray-900 mb-1" style={{ color: categoryColor }}>{data.name}</h4>
        <div className="bg-gray-50 p-2 rounded mb-2">
          <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Rilevanza dell'impatto:</span> {data.y}%</p>
          <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Rilevanza finanziaria:</span> {data.x}%</p>
          {data.stakeholderRelevance > 0 && (
            <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Rilevanza stakeholder:</span> {data.stakeholderRelevance}%</p>
          )}
          <p className="text-sm text-gray-700"><span className="font-medium">Importanza complessiva:</span> {Math.round(data.z)}%</p>
        </div>
        <div className="flex items-center">
          <span className={`h-3 w-3 rounded-full mr-2`} style={{ backgroundColor: categoryColor }}></span>
          <span className="text-xs font-medium capitalize">{data.category}</span>
          {data.isMaterial && (
            <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Materiale</span>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default MaterialityTooltip;
