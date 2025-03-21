
import React from 'react';

const WaterTableHeader: React.FC = () => {
  return (
    <thead>
      <tr className="bg-gray-100">
        <th className="p-2 text-left font-medium text-sm text-gray-600">Metrica</th>
        <th className="p-2 text-right font-medium text-sm text-gray-600">Anno Precedente</th>
        <th className="p-2 text-right font-medium text-sm text-gray-600">Anno Corrente</th>
        <th className="p-2 text-right font-medium text-sm text-gray-600">Variazione %</th>
      </tr>
    </thead>
  );
};

export default WaterTableHeader;
