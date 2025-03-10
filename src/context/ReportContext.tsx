
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MaterialityIssue, Stakeholder } from '@/components/report/materiality/types';

// Define the structure of our report data
export interface ReportData {
  environmentalMetrics: {
    carbonEmissions?: number;
    energyConsumption?: number;
    wasteGeneration?: number;
    waterUsage?: number;
    renewableEnergy?: number;
  };
  socialMetrics: {
    employeeDiversity?: number;
    trainingHours?: number;
    communityEngagement?: number;
    employeeSatisfaction?: number;
  };
  conductMetrics: {
    governanceCompliance?: number;
    policyAdherence?: number;
    riskManagement?: number;
  };
  materialityAnalysis: {
    issues?: MaterialityIssue[];
    stakeholders?: Stakeholder[];
    esgScore?: number;
  };
}

// Default empty report data
const defaultReportData: ReportData = {
  environmentalMetrics: {},
  socialMetrics: {},
  conductMetrics: {},
  materialityAnalysis: {}
};

// Mock data for development - will be replaced by actual data
const mockReportData: ReportData = {
  environmentalMetrics: {
    carbonEmissions: 70,
    energyConsumption: 1250,
    wasteGeneration: 48,
    waterUsage: 3200,
    renewableEnergy: 35,
  },
  socialMetrics: {
    employeeDiversity: 65,
    trainingHours: 89,
    communityEngagement: 72,
    employeeSatisfaction: 78,
  },
  conductMetrics: {
    governanceCompliance: 95,
    policyAdherence: 85,
    riskManagement: 12,
  },
  materialityAnalysis: {
    esgScore: 82,
  },
};

interface ReportContextType {
  reportData: ReportData;
  updateReportData: (data: Partial<ReportData>) => void;
  resetReportData: () => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In a real app, we'd load this from localStorage or a backend
  const [reportData, setReportData] = useState<ReportData>(() => {
    try {
      const savedData = localStorage.getItem('sustainabilityReportData');
      // For now, use mock data if nothing is saved
      return savedData ? JSON.parse(savedData) : mockReportData;
    } catch (error) {
      console.error('Error loading report data from localStorage:', error);
      return mockReportData;
    }
  });

  // Save data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('sustainabilityReportData', JSON.stringify(reportData));
    } catch (error) {
      console.error('Error saving report data to localStorage:', error);
    }
  }, [reportData]);

  const updateReportData = (newData: Partial<ReportData>) => {
    setReportData(prevData => ({
      ...prevData,
      ...newData,
      environmentalMetrics: {
        ...prevData.environmentalMetrics,
        ...(newData.environmentalMetrics || {})
      },
      socialMetrics: {
        ...prevData.socialMetrics,
        ...(newData.socialMetrics || {})
      },
      conductMetrics: {
        ...prevData.conductMetrics,
        ...(newData.conductMetrics || {})
      },
      materialityAnalysis: {
        ...prevData.materialityAnalysis,
        ...(newData.materialityAnalysis || {})
      }
    }));
  };

  const resetReportData = () => {
    setReportData(defaultReportData);
  };

  return (
    <ReportContext.Provider value={{ reportData, updateReportData, resetReportData }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};
