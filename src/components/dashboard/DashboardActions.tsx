
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { Report } from '@/context/types';

interface DashboardActionsProps {
  onGoToCompanies: () => void;
  onEditReport: () => void;
  selectedReport: Report | null;
  accessError: boolean;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({
  onGoToCompanies,
  onEditReport,
  selectedReport,
  accessError
}) => {
  return (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={onGoToCompanies}
      >
        <ArrowLeft className="h-4 w-4" />
        Torna alle Aziende
      </Button>
      
      {selectedReport && !accessError && (
        <Button 
          className="flex items-center gap-2"
          onClick={onEditReport}
        >
          <FileText className="h-4 w-4" />
          Modifica Report
        </Button>
      )}
    </div>
  );
};

export default DashboardActions;
