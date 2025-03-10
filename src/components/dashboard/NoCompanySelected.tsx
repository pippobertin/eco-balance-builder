
import React from 'react';
import { Button } from '@/components/ui/button';

interface NoCompanySelectedProps {
  onGoToCompanies: () => void;
}

const NoCompanySelected: React.FC<NoCompanySelectedProps> = ({ onGoToCompanies }) => {
  return (
    <div className="text-center py-10 my-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-xl font-medium text-gray-800 mb-2">Nessuna azienda selezionata</h3>
      <p className="text-gray-700 mb-4">Seleziona un'azienda e un report per visualizzare i dati nella dashboard.</p>
      <Button onClick={onGoToCompanies}>Vai alla lista aziende</Button>
    </div>
  );
};

export default NoCompanySelected;
