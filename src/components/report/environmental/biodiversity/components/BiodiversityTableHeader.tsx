
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

const BiodiversityTableHeader: React.FC = () => {
  return (
    <thead>
      <tr className="border-b border-gray-200">
        <th className="py-3 text-left font-medium text-gray-500 w-1/3">Metrica</th>
        <th className="py-3 text-center font-medium text-gray-500">
          <div className="flex items-center justify-center">
            <span>Anno precedente</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="ml-1 h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Valori relativi all'anno fiscale precedente</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </th>
        <th className="py-3 text-center font-medium text-gray-500">
          <div className="flex items-center justify-center">
            <span>Anno corrente</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="ml-1 h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Valori relativi all'anno fiscale corrente</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </th>
        <th className="py-3 text-center font-medium text-gray-500">Variazione %</th>
      </tr>
    </thead>
  );
};

export default BiodiversityTableHeader;
