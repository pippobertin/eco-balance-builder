
import { MaterialityIssue } from '../types';
import { getESGCategory, calculateImportanceScore } from './esgCategoryUtils';

export interface ChartDataPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  category: 'environmental' | 'social' | 'governance';
  isMaterial: boolean;
  stakeholderRelevance: number;
}

/**
 * Processes materiality issues into chart data
 * @param issues List of materiality issues
 * @returns Processed chart data ready for visualization
 */
export const processChartData = (issues: MaterialityIssue[]): ChartDataPoint[] => {
  return issues.map(issue => {
    const category = getESGCategory(issue.id);
    const importanceScore = calculateImportanceScore(issue);
    
    return {
      id: issue.id,
      name: issue.name,
      x: issue.financialRelevance,
      y: issue.impactRelevance,
      z: importanceScore, // Bubble size based on importance score
      category,
      isMaterial: issue.isMaterial,
      stakeholderRelevance: issue.stakeholderRelevance || 0,
    };
  });
};

/**
 * Groups chart data by ESG category
 * @param chartData Processed chart data
 * @returns An object containing arrays of data points grouped by ESG category
 */
export const groupDataByCategory = (chartData: ChartDataPoint[]) => {
  const environmentalIssues = chartData.filter(d => d.category === 'environmental');
  const socialIssues = chartData.filter(d => d.category === 'social');
  const governanceIssues = chartData.filter(d => d.category === 'governance');
  
  return {
    environmentalIssues,
    socialIssues,
    governanceIssues
  };
};
