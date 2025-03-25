import React from 'react';
import { useReport } from '@/context/ReportContext';
import { Info } from 'lucide-react';
import BP1RevenueSectors from './BP1RevenueSectors';

const BusinessPartnersMetrics: React.FC = () => {
  const { currentReport } = useReport();
  
  if (!currentReport) {
    return <div className="p-4">Nessun report selezionato</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Modulo Partner Commerciali</h2>
      
      <div className="p-4 rounded-md mb-4 bg-slate-100">
        <div className="flex items-start">
          <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
          <p className="text-sm text-slate-600">
            Questo modulo individua elementi d'informativa in relazione alle informazioni generalmente richieste dai partner commerciali, dagli investitori e dai finanziatori dell'impresa. Le informative da BP1 a BP11 devono essere considerate e comunicate se applicabili o rilevanti per l'attività dell'impresa.
          </p>
        </div>
      </div>

      {/* BP1 - Ricavi in alcuni settori */}
      <BP1RevenueSectors reportId={currentReport.id} />
      
      {/* Altri moduli BP verranno aggiunti qui, uno per ciascun modulo BP2-BP11 */}
    </div>
  );
};

export default BusinessPartnersMetrics;
