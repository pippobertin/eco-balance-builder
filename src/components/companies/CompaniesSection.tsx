
import React from 'react';
import { useReport } from '@/context/ReportContext';
import CompaniesContainer from './CompaniesContainer';

const CompaniesSection = () => {
  const { companies } = useReport();
  
  // Just render the container, which handles all state logic
  return <CompaniesContainer />;
};

export default React.memo(CompaniesSection);
