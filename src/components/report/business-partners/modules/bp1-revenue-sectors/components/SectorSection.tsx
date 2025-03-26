
import React from 'react';
import SectorCheckbox from './SectorCheckbox';
import RevenueInput from './RevenueInput';

interface SectorSectionProps {
  sectorId: string;
  sectorLabel: string;
  checked: boolean;
  onCheckChange: () => void;
  revenueField: string;
  revenueValue: number | undefined;
  onRevenueChange: (field: string, value: string) => void;
  children?: React.ReactNode;
}

const SectorSection: React.FC<SectorSectionProps> = ({
  sectorId,
  sectorLabel,
  checked,
  onCheckChange,
  revenueField,
  revenueValue,
  onRevenueChange,
  children
}) => {
  return (
    <div className="space-y-2">
      <SectorCheckbox 
        id={sectorId} 
        label={sectorLabel} 
        checked={checked} 
        onChange={onCheckChange}
      />
      
      {checked && (
        <>
          {!children ? (
            <div>
              <RevenueInput
                id={revenueField}
                label="Percentuale dei ricavi (%)"
                value={revenueValue ?? ''}
                onChange={(value) => onRevenueChange(revenueField, value)}
              />
            </div>
          ) : (
            children
          )}
        </>
      )}
    </div>
  );
};

export default SectorSection;
