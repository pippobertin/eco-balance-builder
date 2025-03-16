
import React from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { UploadStatus } from './types';

interface StatusIndicatorProps {
  status: UploadStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  if (status === 'idle') {
    return null;
  }

  if (status === 'uploading') {
    return (
      <div className="flex items-center text-orange-500">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        <span>Upload in corso...</span>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex items-center text-green-500">
        <CheckCircle className="h-4 w-4 mr-2" />
        <span>Upload completato</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center text-red-500">
        <AlertCircle className="h-4 w-4 mr-2" />
        <span>Errore</span>
      </div>
    );
  }

  return null;
};

export default StatusIndicator;
