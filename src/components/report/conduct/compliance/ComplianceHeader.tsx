
import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { useReport } from '@/hooks/use-report-context';

const ComplianceHeader: React.FC = () => {
  const { needsSaving, lastSaved } = useReport();

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <ClipboardCheck className="mr-2 h-5 w-5 text-blue-600" />
        <h3 className="text-xl font-semibold">Compliance con standard di condotta</h3>
      </div>
      <AutoSaveIndicator needsSaving={needsSaving} lastSaved={lastSaved} />
    </div>
  );
};

export default ComplianceHeader;
