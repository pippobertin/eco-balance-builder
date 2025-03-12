
import React from 'react';
import { Target } from 'lucide-react';

const MaterialityIntro: React.FC = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <Target className="mr-2 h-5 w-5 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-900">Valutazione della Doppia Materialità</h3>
      </div>
      
      <p className="text-sm text-gray-800 mb-4">
        L'analisi di materialità valuta la rilevanza delle questioni di sostenibilità considerando due dimensioni:
        <br />- <strong>Rilevanza dell'impatto:</strong> impatti effettivi o potenziali sulle persone o sull'ambiente
        <br />- <strong>Rilevanza finanziaria:</strong> rischi e opportunità finanziarie che derivano dalle questioni di sostenibilità
      </p>
      
      <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
        <p className="text-sm font-medium mb-2 text-gray-900">Come utilizzare questo strumento:</p>
        <ol className="text-sm space-y-1 list-decimal pl-4 text-gray-800">
          <li>Valuta la rilevanza dell'impatto per ciascuna questione spostando il primo slider</li>
          <li>Valuta la rilevanza finanziaria spostando il secondo slider</li>
          <li>Contrassegna come "materiale" le questioni che consideri rilevanti</li>
          <li>Aggiungi questioni personalizzate o selezionane tra quelle predefinite</li>
        </ol>
      </div>
    </div>
  );
};

export default MaterialityIntro;
