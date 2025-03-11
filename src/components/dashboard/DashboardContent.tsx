
import React from 'react';
import { ReportData } from '@/context/types';
import DashboardSummaryCards from './DashboardSummaryCards';
import CompanyInfo from './CompanyInfo';
import { Company, Report } from '@/context/types';
import EnvironmentalSection from './sections/EnvironmentalSection';
import SocialSection from './sections/SocialSection';
import GovernanceSection from './sections/GovernanceSection';
import BusinessPartnersSection from './sections/BusinessPartnersSection';

interface DashboardContentProps {
  displayData: ReportData;
  company: Company;
  report: Report;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ displayData, company, report }) => {
  return (
    <>
      <CompanyInfo company={company} report={report} />
      <DashboardSummaryCards reportData={displayData} />
      
      <div className="space-y-8 mt-8">
        <EnvironmentalSection 
          reportData={displayData} 
          companyName={company.name} 
        />
        
        <SocialSection 
          reportData={displayData} 
          companyName={company.name} 
        />
        
        <GovernanceSection 
          reportData={displayData} 
          companyName={company.name} 
        />

        <BusinessPartnersSection 
          reportData={displayData} 
          companyName={company.name} 
        />
      </div>
    </>
  );
};

export default DashboardContent;
