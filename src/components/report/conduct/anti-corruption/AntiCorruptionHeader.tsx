
import React from 'react';
import { Building2 } from 'lucide-react';

interface AntiCorruptionHeaderProps {
  reportId?: string;
  isSaving?: boolean;
  lastSaved?: Date | null;
}

const AntiCorruptionHeader: React.FC<AntiCorruptionHeaderProps> = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <Building2 className="mr-2 h-5 w-5 text-purple-500" />
        <h3 className="text-xl font-semibold">B12 - Condanne e sanzioni per corruzione attiva e passiva</h3>
      </div>
    </div>
  );
};

export default AntiCorruptionHeader;
