
import React from 'react';
import { Button } from '@/components/ui/button';

interface NoReportDataProps {
  onEditReport: () => void;
}

const NoReportData: React.FC<NoReportDataProps> = ({ onEditReport }) => {
  return (
    <div className="text-center py-10 my-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-xl font-medium text-gray-800 mb-2">Nessun dato di sostenibilità disponibile</h3>
      <p className="text-gray-700 mb-4">Non sono stati trovati dati ESG per il periodo selezionato.</p>
      <p className="text-gray-600">Compila il report di sostenibilità per visualizzare i dati nella dashboard.</p>
      <Button onClick={onEditReport} className="mt-4">Compila Report</Button>
    </div>
  );
};

export default NoReportData;
