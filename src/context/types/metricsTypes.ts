
// Define environmental metrics by location
export interface LocationEnvironmentalMetrics {
  location_id: string;
  location_name?: string;
  location_type?: string;
  metrics: {
    carbonEmissions?: number;
    energyConsumption?: number;
    fossilFuelEnergy?: number;
    renewableEnergy?: number;
    wasteGeneration?: number;
    waterUsage?: number;
    waterConsumption?: number;
    waterStressAreas?: number;
    scope1Data?: any;
    scope2Data?: any;
    scope3Data?: any;
    totalScope1Emissions?: number;
    totalScope2Emissions?: number;
    totalScope3Emissions?: number;
    totalScopeEmissions?: number;
    airPollution?: number;
    waterPollution?: number;
    soilPollution?: number;
    landUse?: number;
    impermeableSurface?: number;
    natureSurfaceOnSite?: number;
    natureSurfaceOffSite?: number;
    totalWaste?: number;
    recycledWaste?: number;
    hazardousWaste?: number;
    hazardousWasteRecycled?: number;
    recycledContent?: number;
    recyclableContent?: number;
    energyEmissionsDetails?: string;
    pollutionDetails?: string;
    biodiversityDetails?: string;
    waterDetails?: string;
    resourcesDetails?: string;
  };
}

// Import Materiality types
import { MaterialityIssue, Stakeholder } from '@/components/report/materiality/types';

// Define the structure of report data
export interface ReportData {
  environmentalMetrics: {
    carbonEmissions?: number;
    energyConsumption?: number;
    fossilFuelEnergy?: number;
    renewableEnergy?: number;
    wasteGeneration?: number;
    waterUsage?: number;
    waterConsumption?: number;
    waterStressAreas?: number;
    scope1Data?: any;
    scope2Data?: any;
    scope3Data?: any;
    totalScope1Emissions?: number;
    totalScope2Emissions?: number;
    totalScope3Emissions?: number;
    totalScopeEmissions?: number;
    emissionCalculationLogs?: string;
    airPollution?: number;
    waterPollution?: number;
    soilPollution?: number;
    landUse?: number;
    impermeableSurface?: number;
    natureSurfaceOnSite?: number;
    natureSurfaceOffSite?: number;
    totalWaste?: number;
    recycledWaste?: number;
    hazardousWaste?: number;
    hazardousWasteRecycled?: number;
    recycledContent?: number;
    recyclableContent?: number;
    energyEmissionsDetails?: string;
    pollutionDetails?: string;
    biodiversityDetails?: string;
    waterDetails?: string;
    resourcesDetails?: string;
    
    locationMetrics?: LocationEnvironmentalMetrics[];
  };
  socialMetrics: {
    employeeDiversity?: number;
    trainingHours?: number;
    communityEngagement?: number;
    employeeSatisfaction?: number;
    genderRatio?: number;
    permanentEmployeePercentage?: number;
    maleEmployees?: number;
    femaleEmployees?: number;
    otherGenderEmployees?: number;
    totalEmployees?: number;
    permanentEmployees?: number;
    temporaryEmployees?: number;
    fullTimeEmployees?: number;
    partTimeEmployees?: number;
    avgTrainingHoursMale?: number;
    avgTrainingHoursFemale?: number;
    employeesByCountry?: string;
    workAccidentsNumber?: number;
    totalHoursWorked?: number;
    workAccidentsRate?: number;
    workAccidentDeaths?: number;
    workDiseaseDeaths?: number;
    entryWage?: number;
    localMinimumWage?: number;
    entryWageToMinimumWageRatio?: number;
    genderPayGap?: number;
    collectiveBargainingCoverage?: number;
    totalEmployeesFTE?: number;
    supplyChainImpactProcess?: string;
    identifiedImpacts?: string;
    employeeTurnover?: number;
    workAccidents?: number;
  };
  conductMetrics: {
    governanceCompliance?: number;
    policyAdherence?: number;
    riskManagement?: number;
    codeOfConductViolations?: number;
    antiCorruptionTraining?: number;
    boardDiversity?: number;
    executivePayRatio?: number;
    sustainabilityCommittee?: number;
    antiCorruptionConvictions?: number;
    antiCorruptionSanctions?: number;
  };
  businessPartnersMetrics?: {
    totalSuppliers?: number;
    localSuppliers?: number;
    internationalSuppliers?: number;
    certifiedSuppliers?: number;
    suppliersWithEsgRating?: number;
    criticalSuppliers?: number;
    avgPaymentTime?: number;
    avgContractDuration?: number;
    positiveEsgImpactSuppliers?: number;
    negativeEsgImpactSuppliers?: number;
    totalSuppliersScreened?: number;
  };
  materialityAnalysis: {
    issues?: MaterialityIssue[];
    stakeholders?: Stakeholder[];
    esgScore?: number;
  };
  narrativePATMetrics?: any;
}

// Default empty report data
export const defaultReportData: ReportData = {
  environmentalMetrics: {
    locationMetrics: []
  },
  socialMetrics: {},
  conductMetrics: {},
  businessPartnersMetrics: {},
  materialityAnalysis: {
    issues: [],
    stakeholders: []
  }
};
