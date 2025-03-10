
import { Company, Report } from './types';

// Local storage keys
const CURRENT_COMPANY_ID = 'currentCompanyId';
const CURRENT_REPORT_ID = 'currentReportId';

export const localStorageOperations = {
  // Save current company ID to localStorage
  saveCurrentCompanyId: (companyId: string | null) => {
    if (companyId) {
      localStorage.setItem(CURRENT_COMPANY_ID, companyId);
    } else {
      localStorage.removeItem(CURRENT_COMPANY_ID);
    }
  },

  // Save current report ID to localStorage
  saveCurrentReportId: (reportId: string | null) => {
    if (reportId) {
      localStorage.setItem(CURRENT_REPORT_ID, reportId);
    } else {
      localStorage.removeItem(CURRENT_REPORT_ID);
    }
  },

  // Get current company ID from localStorage
  getCurrentCompanyId: (): string | null => {
    return localStorage.getItem(CURRENT_COMPANY_ID);
  },

  // Get current report ID from localStorage
  getCurrentReportId: (): string | null => {
    return localStorage.getItem(CURRENT_REPORT_ID);
  }
};
