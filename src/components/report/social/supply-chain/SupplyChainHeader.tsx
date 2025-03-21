
import React from 'react';
import { Link } from 'lucide-react';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';

interface SupplyChainHeaderProps {
  reportId?: string;
  isSaving: boolean;
  lastSaved: Date | null;
}

const SupplyChainHeader: React.FC<SupplyChainHeaderProps> = ({ 
  reportId, 
  isSaving, 
  lastSaved 
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Link className="mr-2 h-5 w-5 text-purple-500" />
          <h3 className="text-xl font-semibold">B11 - Lavoratori nella catena del valore, comunità e consumatori</h3>
        </div>
        
        {reportId && (
          <AutoSaveIndicator 
            needsSaving={isSaving} 
            lastSaved={lastSaved} 
          />
        )}
      </div>
    </div>
  );
};

export default SupplyChainHeader;
