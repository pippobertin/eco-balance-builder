
import React from 'react';

const NoIssuesFound: React.FC = () => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Nessuna questione di materialità selezionata per questo tema.</p>
      <p className="text-gray-500 text-sm mt-2">
        Trascina i temi dalla colonna "Temi disponibili" a "Temi selezionati" per includerli nell'analisi di materialità.
      </p>
    </div>
  );
};

export default NoIssuesFound;
