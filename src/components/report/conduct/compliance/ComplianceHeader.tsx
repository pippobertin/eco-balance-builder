
import React from 'react';
import { ClipboardCheck } from 'lucide-react';

const ComplianceHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <ClipboardCheck className="mr-2 h-5 w-5 text-blue-600" />
        <h3 className="text-xl font-semibold">Compliance con standard di condotta</h3>
      </div>
    </div>
  );
};

export default ComplianceHeader;
