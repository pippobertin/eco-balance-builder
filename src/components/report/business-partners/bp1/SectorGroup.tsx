
import React from 'react';
import { SectorCheckbox } from './SectorCheckbox';
import { RevenueInput } from './RevenueInput';

interface RevenueSectionProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: number | undefined) => void;
}

interface SectorGroupProps {
  checkboxId: string;
  checkboxLabel: string;
  isChecked: boolean;
  onCheckboxChange: () => void;
  revenueSections: RevenueSectionProps[];
}

export const SectorGroup: React.FC<SectorGroupProps> = ({
  checkboxId,
  checkboxLabel,
  isChecked,
  onCheckboxChange,
  revenueSections
}) => {
  return (
    <div className="space-y-3">
      <SectorCheckbox
        id={checkboxId}
        label={checkboxLabel}
        checked={isChecked}
        onChange={onCheckboxChange}
      />
      
      {isChecked && revenueSections.length > 0 && (
        <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
