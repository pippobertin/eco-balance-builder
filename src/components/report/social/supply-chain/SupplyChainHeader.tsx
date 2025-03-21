
import React from 'react';
import { Link } from 'lucide-react';

interface SupplyChainHeaderProps {
  reportId?: string;
  isSaving?: boolean;
  lastSaved?: Date | null;
}

const SupplyChainHeader: React.FC<SupplyChainHeaderProps> = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <Link className="mr-2 h-5 w-5 text-purple-500" />
        <h3 className="text-xl font-semibold">B11 - Lavoratori nella catena del valore, comunità e consumatori</h3>
      </div>
    </div>
  );
};

export default SupplyChainHeader;
