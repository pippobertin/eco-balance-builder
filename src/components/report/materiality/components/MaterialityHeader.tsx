
import React from 'react';

interface MaterialityHeaderProps {
  title: string;
}

const MaterialityHeader: React.FC<MaterialityHeaderProps> = ({ title }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
};

export default MaterialityHeader;
