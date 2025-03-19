
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, FileBarChart, Trash2 } from 'lucide-react';
import { Report } from '@/context/types';
import { useReport } from '@/context/ReportContext';

interface ReportListProps {
  reports: Report[];
  onDelete: (report: Report, e: React.MouseEvent) => void;
  onSelectReport?: (report: Report) => Promise<void> | void;
}

const ReportList = ({ reports, onDelete, onSelectReport }: ReportListProps) => {
  const navigate = useNavigate();
  const { loadReport, setCurrentCompany, companies } = useReport();

  const handleOpenReport = async (report: Report) => {
    const company = companies.find(c => c.id === report.company_id) || null;
    setCurrentCompany(company);
    
    if (onSelectReport) {
      await onSelectReport(report);
    } else {
      await loadReport(report.id);
    }
    
    navigate('/report');
  };
  
  const handleViewDashboard = async (report: Report) => {
    const company = companies.find(c => c.id === report.company_id) || null;
    setCurrentCompany(company);
    
    if (onSelectReport) {
      await onSelectReport(report);
    } else {
      await loadReport(report.id);
    }
    
    navigate('/dashboard');
  };

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div 
          key={report.id} 
          className="p-5 rounded-lg border border-gray-200 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium">
                Report anno {report.report_year}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewDashboard(report)}
              >
                <FileBarChart className="h-4 w-4 mr-1" />
                Dashboard
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => handleOpenReport(report)}
              >
                Apri Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={(e) => onDelete(report, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Tipo:</span>{" "}
              <span>Opzione {report.report_type}</span>
            </div>
            <div>
              <span className="text-gray-500">Rendicontazione:</span>{" "}
              <span>{report.is_consolidated ? "Consolidata" : "Individuale"}</span>
            </div>
            <div>
              <span className="text-gray-500">Stato:</span>{" "}
              <span className={`${
                report.status === 'published' ? 'text-green-600' : 'text-amber-600'
              }`}>
                {report.status === 'published' ? 'Pubblicato' : 'Bozza'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportList;
