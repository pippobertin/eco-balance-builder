
import { useState } from 'react';
import { Company, Report } from '../types';
import { localStorageUtils } from './localStorageUtils';

export const useReportEntityState = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  // Set current company with localStorage update
  const setCurrentCompanyWithStorage = (company: Company | null) => {
    setCurrentCompany(company);
    if (company) {
      localStorageUtils.saveCurrentCompanyId(company.id);
    } else {
      localStorageUtils.removeCurrentCompanyId();
    }
  };

  // Set current report with localStorage update
  const setCurrentReportWithStorage = (report: Report | null) => {
    setCurrentReport(report);
    if (report) {
      localStorageUtils.saveCurrentReportId(report.id);
    } else {
      localStorageUtils.removeCurrentReportId();
    }
  };

  return {
    companies,
    setCompanies,
    reports,
    setReports,
    currentCompany,
    setCurrentCompany: setCurrentCompanyWithStorage,
    currentReport,
    setCurrentReport: setCurrentReportWithStorage,
    loading,
    setLoading
  };
};
