
import React from 'react';
import { Input } from "@/components/ui/input";
import { TooltipRenderer } from '@/components/report/environmental/biodiversity/components';
import { Button } from "@/components/ui/button";

interface WaterTableRowProps {
  label: string;
  tooltipTitle: string;
  tooltipContent: string;
  previousValue: number | null;
  currentValue: number | null;
  percentageChange: number | null;
  previousFieldName: string;
  currentFieldName: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  externalLink?: {
    url: string;
    ariaLabel: string;
  };
}

const WaterTableRow: React.FC<WaterTableRowProps> = ({
  label,
  tooltipTitle,
  tooltipContent,
  previousValue,
  currentValue,
  percentageChange,
  previousFieldName,
  currentFieldName,
  handleChange,
  externalLink
}) => {
  const renderPercentageChange = (change: number | null) => {
    if (change === null) return null;
    
    const isPositive = change > 0;
    const isNegative = change < 0;
    const color = isNegative ? 'text-green-600' : isPositive ? 'text-red-600' : 'text-gray-600';
    const sign = isPositive ? '+' : '';
    
    return (
      <span className={`text-xs font-medium ${color}`}>
        {sign}{change.toFixed(1)}%
      </span>
    );
  };
  
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-2 flex items-center">
        <span className="font-medium text-sm">{label}</span>
        <TooltipRenderer
          title={tooltipTitle}
          content={tooltipContent}
        />
        {externalLink && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 ml-1 p-0"
            asChild
          >
            <a
              href={externalLink.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={externalLink.ariaLabel}
            >
              <img 
                src="/lovable-uploads/bf31d396-a7a6-4861-86e0-33b07271cf30.png" 
                alt="Aqueduct" 
                className="h-5 w-auto"
              />
            </a>
          </Button>
        )}
      </td>
      <td className="p-2">
        <Input
          type="number"
          name={previousFieldName}
          value={previousValue === null ? '' : previousValue}
          onChange={handleChange}
          className="text-right"
          placeholder="0"
        />
      </td>
      <td className="p-2">
        <Input
          type="number"
          name={currentFieldName}
          value={currentValue === null ? '' : currentValue}
          onChange={handleChange}
          className="text-right"
          placeholder="0"
        />
      </td>
      <td className="p-2 text-right">
        {renderPercentageChange(percentageChange)}
      </td>
    </tr>
  );
};

export default WaterTableRow;
