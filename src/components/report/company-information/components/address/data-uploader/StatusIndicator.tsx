
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { UploadStatus } from './types';

interface StatusIndicatorProps {
  status: UploadStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  if (status === 'success') {
    return (
      <div className="flex items-center text-green-600">
        <Check className="mr-1 h-4 w-4" /> Caricamento completato con successo
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="flex items-center text-red-600">
        <AlertCircle className="mr-1 h-4 w-4" /> Si è verificato un errore
      </div>
    );
  }
  
  return <div />;
};

export default StatusIndicator;
