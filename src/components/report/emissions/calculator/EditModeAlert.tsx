
import React from 'react';
import { Edit } from 'lucide-react';

interface EditModeAlertProps {
  editMode: boolean;
}

const EditModeAlert: React.FC<EditModeAlertProps> = ({ editMode }) => {
  if (!editMode) return null;
  
  return (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <div className="flex items-center">
        <Edit className="h-5 w-5 text-blue-500 mr-2" />
        <p className="text-blue-800 font-medium">Modalità modifica - Modifica il calcolo selezionato</p>
      </div>
    </div>
  );
};

export default EditModeAlert;
