
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface AccessErrorProps {
  onGoToCompanies: () => void;
}

const AccessError: React.FC<AccessErrorProps> = ({ onGoToCompanies }) => {
  return (
    <div className="text-center py-10 my-6 bg-red-50 rounded-lg border border-red-200">
      <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-2" />
      <h3 className="text-xl font-medium text-red-800 mb-2">Accesso non autorizzato</h3>
      <p className="text-gray-700 mb-4">Non hai i permessi per visualizzare i report di questa azienda.</p>
      <Button onClick={onGoToCompanies} variant="default">Torna alle tue aziende</Button>
    </div>
  );
};

export default AccessError;
