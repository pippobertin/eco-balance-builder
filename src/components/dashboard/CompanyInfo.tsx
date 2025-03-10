
import React from 'react';
import { Company, Report } from '@/context/types';

interface CompanyInfoProps {
  company: Company;
  report: Report | null;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ company, report }) => {
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <h3 className="text-lg font-medium text-blue-900">
        {company.name}
      </h3>
      {report && (
        <p className="text-sm text-blue-700">
          Report anno: {report.report_year} | 
          Tipo: Opzione {report.report_type} | 
          {report.is_consolidated ? ' Consolidato' : ' Individuale'}
        </p>
      )}
    </div>
  );
};

export default CompanyInfo;
