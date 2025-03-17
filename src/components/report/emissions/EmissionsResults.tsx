
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCcw } from 'lucide-react';

interface EmissionsResultsProps {
  calculatedEmissions: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  };
  onResetClick: () => void;
}

const EmissionsResults: React.FC<EmissionsResultsProps> = ({
  calculatedEmissions,
  onResetClick
}) => {
  const handleResetClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onResetClick();
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <p className="text-xs text-gray-500 mb-1">Risultati del calcolo (tonnellate CO₂e):</p>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="text-center">
            <p className="font-semibold">Scope 1</p>
            <p>{calculatedEmissions.scope1.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Scope 2</p>
            <p>{calculatedEmissions.scope2.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Scope 3</p>
            <p>{calculatedEmissions.scope3.toFixed(2)}</p>
          </div>
          <div className="text-center bg-blue-50 rounded-md p-1">
            <p className="font-semibold">Totale</p>
            <p>{calculatedEmissions.total.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleResetClick}
        className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
      >
        <RefreshCcw className="h-4 w-4" />
        Azzera calcoli
      </Button>
    </div>
  );
};

export default EmissionsResults;
