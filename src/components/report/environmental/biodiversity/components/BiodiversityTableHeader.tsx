
import React from 'react';

const BiodiversityTableHeader: React.FC = () => {
  return (
    <thead>
      <tr className="bg-gray-100">
        <th className="border p-2 text-left">Metrica</th>
        <th className="border p-2 text-center">Anno precedente</th>
        <th className="border p-2 text-center">Anno corrente</th>
        <th className="border p-2 text-center">Variazione %</th>
      </tr>
    </thead>
  );
};

export default BiodiversityTableHeader;
