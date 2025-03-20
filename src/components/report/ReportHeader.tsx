
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Company } from '@/context/types';
import AutoSaveIndicator from './AutoSaveIndicator';
import { useReport } from '@/hooks/use-report-context';

interface ReportHeaderProps {
  currentCompany: Company | null;
  needsSaving: boolean;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ 
  currentCompany,
  needsSaving
}) => {
  const navigate = useNavigate();
  const { saveCurrentReport, lastSaved } = useReport();
  
  const handleSaveClick = async () => {
    if (needsSaving) {
      await saveCurrentReport();
    }
  };

  return (
    <div className="mb-8">
      <Card className="p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/companies')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                Report di Sostenibilità
              </h1>
              <p className="text-gray-500">
                {currentCompany?.name || 'Azienda'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <AutoSaveIndicator 
              needsSaving={needsSaving}
              lastSaved={lastSaved}
              className="mr-4"
            />
            
            <Button 
              variant={needsSaving ? "default" : "outline"} 
              onClick={handleSaveClick}
              disabled={!needsSaving}
              className={needsSaving ? "bg-green-600 hover:bg-green-700 text-white animate-pulse" : ""}
            >
              <Save className="mr-2 h-4 w-4" />
              {needsSaving ? "Salva Modifiche" : "Salvato"}
            </Button>
            
            <Button asChild variant="outline">
              <Link to="/reports/materiality">
                <FileText className="mr-2 h-4 w-4" />
                Analisi di Materialità
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportHeader;
