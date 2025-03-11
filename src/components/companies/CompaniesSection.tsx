import React from 'react';
import CompaniesContainer from './CompaniesContainer';

const CompaniesSection = () => {
  // Keep this as a pure component, all state logic is in CompaniesContainer
  return <CompaniesContainer />;
};

export default React.memo(CompaniesSection);
