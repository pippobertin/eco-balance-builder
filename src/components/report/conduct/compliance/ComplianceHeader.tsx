
import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';

interface ComplianceHeaderProps {
  isSaving: boolean;
  lastSaved: Date | null;
}

const ComplianceHeader: React.FC<ComplianceHeaderProps> = ({ isSaving, lastSaved }) => {
  const needsSaving = isSaving;

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
