
import React, { createContext } from 'react';
import { useReportState } from './report/reportState';
import { ReportContextType } from '@/context/types';
import { Company, Report, Subsidiary, ReportData } from '@/context/types';

// Create context
export const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useReportState();

  // Prepare context value
  const contextValue: ReportContextType = {
    reportData: state.reportData,
    companies: state.companies,
    reports: state.reports,
    currentCompany: state.currentCompany,
    currentReport: state.currentReport,
    updateReportData: state.updateReportData,
    resetReportData: state.resetReportData,
    loadCompanies: state.loadCompanies,
    createCompany: state.handleCreateCompany as (companyData: Partial<Company>) => Promise<Company | null>,
    createReport: state.handleCreateReport as (reportData: Partial<Report>) => Promise<Report | null>,
    loadReports: state.loadReports,
    loadReport: state.loadReport,
    deleteReport: state.handleDeleteReport,
    setCurrentCompany: state.setCurrentCompany,
    setCurrentReport: state.setCurrentReport,
    saveSubsidiaries: state.saveSubsidiaries,
    saveCurrentReport: state.saveCurrentReport,
    needsSaving: state.needsSaving,
    setNeedsSaving: state.setNeedsSaving,
    lastSaved: state.lastSaved,
    setLastSaved: state.setLastSaved || ((date: Date | null) => {})
  };

  return (
    <ReportContext.Provider value={contextValue}>
      {children}
    </ReportContext.Provider>
  );
};

// Re-export types for easier access
export type { Company, Report, Subsidiary, ReportData } from '@/context/types';

// Re-export the hook
export { useReport } from '@/hooks/use-report-context';
