
import React from 'react';
import RevenueInput from './RevenueInput';

interface FossilFuelInputsProps {
  coalRevenue: number | undefined;
  oilRevenue: number | undefined;
  gasRevenue: number | undefined;
  onRevenueChange: (field: string, value: string) => void;
}

const FossilFuelInputs: React.FC<FossilFuelInputsProps> = ({
  coalRevenue,
  oilRevenue,
  gasRevenue,
  onRevenueChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
      <RevenueInput
        id="coalRevenue"
        label="Carbone (%)"
        value={coalRevenue ?? ''}
        onChange={(value) => onRevenueChange('coalRevenue', value)}
      />
      <RevenueInput
        id="oilRevenue"
        label="Petrolio (%)"
        value={oilRevenue ?? ''}
        onChange={(value) => onRevenueChange('oilRevenue', value)}
      />
      <RevenueInput
        id="gasRevenue"
        label="Gas (%)"
        value={gasRevenue ?? ''}
        onChange={(value) => onRevenueChange('gasRevenue', value)}
      />
    </div>
  );
};

export default FossilFuelInputs;
