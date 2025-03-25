
import React from 'react';
import { SectorCheckbox } from './SectorCheckbox';
import { RevenueInput } from './RevenueInput';

interface SectorGroupProps {
  checkboxId: string;
  checkboxLabel: string;
  isChecked: boolean;
  onCheckboxChange: () => void;
  revenueSections?: Array<{
    id: string;
    label: string;
    value: number | string;
    onChange: (value: number | undefined) => void;
  }>;
}

export const SectorGroup: React.FC<SectorGroupProps> = ({
  checkboxId,
  checkboxLabel,
  isChecked,
  onCheckboxChange,
  revenueSections = []
}) => {
  return (
    <div className="space-y-2">
      <SectorCheckbox
        id={checkboxId}
        label={checkboxLabel}
        checked={isChecked}
        onCheckedChange={onCheckboxChange}
      />
      
      {isChecked && revenueSections.length > 0 && (
        <div className="space-y-2 pl-6 mt-2">
          {revenueSections.map((section) => (
            <RevenueInput
              key={section.id}
              id={section.id}
              label={section.label}
              value={section.value}
              onChange={section.onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
