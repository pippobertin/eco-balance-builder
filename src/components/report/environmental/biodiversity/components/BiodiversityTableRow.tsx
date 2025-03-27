
import React from 'react';
import { Input } from '@/components/ui/input';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
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
  const formatPercentage = (value: number | null): string => {
    if (value === null) return '-';
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getPercentageColor = (value: number | null): string => {
    if (value === null) return 'text-gray-500';
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getPercentageIcon = (value: number | null) => {
    if (value === null || value === 0) return null;
    if (value > 0) return <ArrowUpIcon className="h-4 w-4" />;
    return <ArrowDownIcon className="h-4 w-4" />;
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-3">
        <div className="flex items-center">
          <TooltipRenderer title={tooltipTitle} content={tooltipContent}>
            <span>{label}</span>
          </TooltipRenderer>
        </div>
      </td>
      <td className="py-3 px-2">
        <Input
          type="number"
          name={previousFieldName}
          value={previousValue ?? ''}
          onChange={handleChange}
          placeholder="0"
          className="text-center"
          step="0.01"
        />
      </td>
      <td className="py-3 px-2">
        <Input
          type="number"
          name={currentFieldName}
          value={currentValue ?? ''}
          onChange={handleChange}
          placeholder="0"
          className="text-center"
          step="0.01"
        />
      </td>
      <td className="py-3 px-2 text-center">
        <div className={`flex items-center justify-center ${getPercentageColor(percentageChange)}`}>
          {getPercentageIcon(percentageChange)}
          <span>{formatPercentage(percentageChange)}</span>
        </div>
      </td>
    </tr>
  );
};

export default BiodiversityTableRow;
