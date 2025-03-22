
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';

interface ComplianceHeaderProps {
  reportId?: string;
  isSaving: boolean;
  lastSaved: Date | null;
}

const ComplianceHeader: React.FC<ComplianceHeaderProps> = ({
  reportId,
  isSaving,
  lastSaved
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center mb-4">
        <ShieldAlert className="mr-2 h-5 w-5 text-yellow-500" />
        <h3 className="text-xl font-semibold">Compliance con standard di condotta</h3>
      </div>
      
      {reportId && (
        <div className="flex justify-end">
          <AutoSaveIndicator 
            needsSaving={false} 
            lastSaved={lastSaved} 
          />
        </div>
      )}
    </div>
  );
};

export default ComplianceHeader;
