
import React from 'react';
import { Building } from 'lucide-react';

interface HeaderSectionProps {
  title: string;
  icon?: React.ReactNode;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  title, 
  icon = <Building className="mr-2 h-5 w-5 text-blue-500" />
}) => {
  return (
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
};

export default HeaderSection;
