
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useReportDataState } from './reportDataState';
import { useReportEntityState } from './reportEntityState';
import { Company, Report, ReportData, Subsidiary } from '../types';
import { useReportCreate } from './hooks/useReportCreate';
import { useReportLoad } from './hooks/useReportLoad';
import { useReportDelete } from './hooks/useReportDelete';
import { useReportSave } from './hooks/useReportSave';
import { useReportAutoSave } from './hooks/useReportAutoSave';
import { useLocalStorageSync } from './hooks/useLocalStorageSync';
import { useReportOperations } from './reportOperations';

export const useReportState = () => {
  // Initialize hooks
  const entityState = useReportEntityState();
  const dataState = useReportDataState();
  const [loading, setLoading] = useState(false);
  const { loadReport: fetchReport } = useReportOperations();

  // Destructure state
  const {
    companies, setCompanies,
    reports, setReports,
    currentCompany, setCurrentCompany,
    currentReport, setCurrentReport
  } = entityState;

  const {
    reportData, setReportData,
    updateReportData, resetReportData,
    needsSaving, setNeedsSaving,
    lastSaved, setLastSaved
  } = dataState;
  
  // Initialize report CRUD hooks
  const loadHook = useReportLoad(
    setCompanies,
    setReports,
    setCurrentCompany,
    setCurrentReport,
    setReportData
  );
  
  const createHook = useReportCreate(
    setCompanies,
    setReports,
    setCurrentReport,
    resetReportData,
    loadHook.loadCompanies,
    fetchReport
  );
  
  const saveHook = useReportSave(
    currentReport,
    reportData,
    setNeedsSaving,
    setLastSaved
  );
  
  const deleteHook = useReportDelete(
    setReports,
    setCurrentReport,
    resetReportData
  );
  
  // Set up auto-save
  useReportAutoSave(
    needsSaving,
    reportData,
    currentReport,
    saveHook.saveCurrentReport,
    setNeedsSaving,
    setLastSaved
  );
  
  // Set up local storage sync
  useLocalStorageSync(
    loadHook.loadCompanyById,
    loadHook.loadReport,
    loadHook.loadReports,
    setLoading,
    setCurrentCompany,
    setCurrentReport,
    setReportData
  );
  
  // Load companies on initial render
  useEffect(() => {
    loadHook.loadCompanies();
  }, []);

  // Combine loading states
  const isLoading = loading || loadHook.loading || createHook.loading || saveHook.loading || deleteHook.loading;

  return {
    // State
    reportData,
    companies,
    reports,
    currentCompany,
    currentReport,
    loading: isLoading,
    needsSaving, // Added this property
    setNeedsSaving, // Added this property
    lastSaved, // Added this property
    // Methods
    updateReportData,
    resetReportData,
    loadCompanies: loadHook.loadCompanies,
    handleCreateCompany: createHook.handleCreateCompany,
    handleCreateReport: createHook.handleCreateReport,
    loadReports: loadHook.loadReports,
    loadReport: loadHook.loadReport,
    handleDeleteReport: deleteHook.handleDeleteReport,
    setCurrentCompany,
    setCurrentReport,
    saveSubsidiaries: saveHook.saveSubsidiaries,
    saveCurrentReport: saveHook.saveCurrentReport
  };
};
