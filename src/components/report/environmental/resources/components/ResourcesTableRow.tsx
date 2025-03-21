
import React from 'react';
import { Input } from "@/components/ui/input";
import { TooltipRenderer } from '@/components/report/environmental/biodiversity/components';

interface ResourcesTableRowProps {
  label: string;
  tooltipTitle: string;
  tooltipContent: string;
  totalValue: number | null;
  recycledValue: number | null;
  disposalValue: number | null;
  totalFieldName: string;
  recycledFieldName: string;
  disposalFieldName: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isHazardous?: boolean;
}

const ResourcesTableRow: React.FC<ResourcesTableRowProps> = ({
  label,
  tooltipTitle,
  tooltipContent,
  totalValue,
  recycledValue,
  disposalValue,
  totalFieldName,
  recycledFieldName,
  disposalFieldName,
  handleChange,
  isHazardous = false
}) => {
  return (
    <tr className={`hover:bg-gray-50 ${isHazardous ? 'bg-red-50' : ''}`}>
      <td className="p-2 flex items-center">
        <span className={`font-medium text-sm ${isHazardous ? 'text-red-700' : ''}`}>{label}</span>
        <TooltipRenderer
          title={tooltipTitle}
          content={tooltipContent}
        />
      </td>
      <td className="p-2">
        <Input
          type="number"
          name={totalFieldName}
          value={totalValue === null ? '' : totalValue}
          onChange={handleChange}
          className="text-right"
          placeholder="0"
        />
      </td>
      <td className="p-2">
        <Input
          type="number"
          name={recycledFieldName}
          value={recycledValue === null ? '' : recycledValue}
          onChange={handleChange}
          className="text-right"
          placeholder="0"
        />
      </td>
      <td className="p-2">
        <Input
          type="number"
          name={disposalFieldName}
          value={disposalValue === null ? '' : disposalValue}
          onChange={handleChange}
          className="text-right"
          placeholder="0"
        />
      </td>
    </tr>
  );
};

export default ResourcesTableRow;
