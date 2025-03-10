
import React from 'react';
import { ReportData } from '@/context/types';
import DashboardSummaryCards from './DashboardSummaryCards';
import DashboardCharts from './DashboardCharts';
import CompanyInfo from './CompanyInfo';
import { Company, Report } from '@/context/types';

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
      <DashboardCharts reportData={displayData} companyName={company.name} />
    </>
  );
};

export default DashboardContent;
