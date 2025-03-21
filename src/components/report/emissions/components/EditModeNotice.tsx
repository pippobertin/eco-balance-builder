
import React from 'react';
import { Edit } from 'lucide-react';

const EditModeNotice: React.FC = () => {
  return (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <div className="flex items-center">
        <Edit className="h-5 w-5 text-blue-500 mr-2" />
        <p className="text-blue-800 font-medium">Modalità modifica - Modifica il calcolo selezionato</p>
      </div>
      <p className="text-blue-600 text-sm mt-1 ml-7">Apporta le modifiche necessarie e clicca "Aggiorna Calcolo" per salvare</p>
    </div>
  );
};

export default EditModeNotice;
