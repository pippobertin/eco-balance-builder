
import React from 'react';
import { GHGEmissionsCalculatorProps } from './emissions/types';
import EmissionsCalculatorContainer from './emissions/components/EmissionsCalculatorContainer';

const GHGEmissionsCalculator: React.FC<GHGEmissionsCalculatorProps> = (props) => {
  return <EmissionsCalculatorContainer {...props} />;
};

export default GHGEmissionsCalculator;
