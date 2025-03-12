
import React from 'react';

const NoIssuesFound: React.FC = () => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Nessuna questione di materialità aggiunta per questo tema.</p>
      <p className="text-gray-500 text-sm mt-2">
        Usa il pulsante "Aggiungi temi predefiniti" per selezionare le questioni predefinite o aggiungi una questione personalizzata utilizzando il modulo sottostante.
      </p>
    </div>
  );
};

export default NoIssuesFound;
