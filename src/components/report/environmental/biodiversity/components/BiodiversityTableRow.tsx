
import React from 'react';
import { Input } from "@/components/ui/input";
import TooltipRenderer from './TooltipRenderer';

interface BiodiversityTableRowProps {
  label: string;
  tooltipTitle: string;
  tooltipContent: string;
  previousValue: number | null;
  currentValue: number | null;
  percentageChange: number | null;
  previousFieldName: string;
  currentFieldName: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BiodiversityTableRow: React.FC<BiodiversityTableRowProps> = ({
  label,
  tooltipTitle,
  tooltipContent,
  previousValue,
  currentValue,
  percentageChange,
  previousFieldName,
  currentFieldName,
  handleChange
}) => {
  // Format percentage change with sign and decimals
  const formatPercentage = (value: number | null) => {
    if (value === null) return '-';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <tr>
      <td className="border p-2 flex items-center">
        <span className="font-medium">{label}</span>
        <TooltipRenderer title={tooltipTitle} content={tooltipContent} />
      </td>
      <td className="border p-2">
        <Input 
          type="number" 
          name={previousFieldName} 
          value={previousValue ?? ''} 
          onChange={handleChange} 
          step="0.01"
          className="text-center"
        />
      </td>
      <td className="border p-2">
        <Input 
          type="number" 
          name={currentFieldName} 
          value={currentValue ?? ''} 
          onChange={handleChange} 
          step="0.01"
          className="text-center"
        />
      </td>
      <td className="border p-2 text-center">
        {formatPercentage(percentageChange)}
      </td>
    </tr>
  );
};

export default BiodiversityTableRow;
