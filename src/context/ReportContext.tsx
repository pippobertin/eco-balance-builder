
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
    scope1Data?: any;
    scope2Data?: any;
    scope3Data?: any;
    totalScope1Emissions?: number;
    totalScope2Emissions?: number;
    totalScope3Emissions?: number;
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
  narrativePATMetrics?: any;
}

// Default empty report data
const defaultReportData: ReportData = {
  environmentalMetrics: {},
  socialMetrics: {},
  conductMetrics: {},
  materialityAnalysis: {
    issues: [],
    stakeholders: []
  }
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
      // Use saved data or default empty data
      return savedData ? JSON.parse(savedData) : defaultReportData;
    } catch (error) {
      console.error('Error loading report data from localStorage:', error);
      return defaultReportData;
    }
  });

  // Save data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('sustainabilityReportData', JSON.stringify(reportData));
      console.log("Dati salvati nel localStorage:", reportData);
    } catch (error) {
      console.error('Error saving report data to localStorage:', error);
    }
  }, [reportData]);

  const updateReportData = (newData: Partial<ReportData>) => {
    setReportData(prevData => {
      const updatedData = {
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
      };
      
      console.log("Dati del report aggiornati:", updatedData);
      return updatedData;
    });
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
