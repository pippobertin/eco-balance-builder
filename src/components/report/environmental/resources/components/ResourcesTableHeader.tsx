
import React from 'react';

const ResourcesTableHeader: React.FC = () => {
  return (
    <thead>
      <tr className="bg-gray-100">
        <th className="p-2 text-left font-medium text-sm text-gray-600">Tipo di Rifiuto</th>
        <th className="p-2 text-right font-medium text-sm text-gray-600">Totale Rifiuti (t)</th>
        <th className="p-2 text-right font-medium text-sm text-gray-600">Destinati a Riciclo o Riutilizzo (t)</th>
        <th className="p-2 text-right font-medium text-sm text-gray-600">Destinati a Smaltimento (t)</th>
      </tr>
    </thead>
  );
};

export default ResourcesTableHeader;
