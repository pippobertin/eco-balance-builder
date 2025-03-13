
import React from 'react';
import { MaterialityIssue } from '../../types';

interface DragOverlayProps {
  activeItem?: MaterialityIssue;
}

const DragOverlay: React.FC<DragOverlayProps> = ({ activeItem }) => {
  if (!activeItem) return null;
  
  return (
    <div 
      className="fixed pointer-events-none top-0 left-0 w-full h-full z-50"
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}
    >
      <div className="p-3 rounded-lg border bg-white border-blue-300 shadow-lg opacity-90 max-w-xs">
        {activeItem.name}
      </div>
    </div>
  );
};

export default DragOverlay;
