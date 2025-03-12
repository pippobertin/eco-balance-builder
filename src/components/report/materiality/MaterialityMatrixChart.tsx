import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer } from 'recharts';
import { MaterialityIssue } from './types';

interface MaterialityMatrixChartProps {
  issues: MaterialityIssue[];
}

// Helper function to determine ESG category based on issue ID
const getESGCategory = (issueId: string): 'environmental' | 'social' | 'governance' => {
  if (
    issueId.startsWith('climate') || 
    issueId.startsWith('water') || 
    issueId.startsWith('biodiversity') || 
    issueId.startsWith('pollution') || 
    issueId.startsWith('resource') || 
    issueId === 'energy' || 
    issueId === 'waste' ||
    issueId.includes('ecosystem') ||
    issueId.includes('substances') ||
    issueId.includes('marine') ||
    issueId.includes('soil')
  ) {
    return 'environmental';
  } else if (
    issueId.startsWith('labor') || 
    issueId.startsWith('supply-labor') || 
    issueId.startsWith('community') || 
    issueId.startsWith('indigenous') || 
    issueId.startsWith('consumer') ||
    issueId.startsWith('health') ||
    issueId.startsWith('safety') ||
    issueId.includes('diversity') ||
    issueId.includes('inclusion') ||
    issueId.includes('human-rights')
  ) {
    return 'social';
  } else {
    return 'governance';
  }
};

// Helper function to calculate the importance score
const calculateImportanceScore = (issue: MaterialityIssue): number => {
  let importanceScore = (issue.impactRelevance + issue.financialRelevance) / 2;
  
  // If stakeholder relevance is available, include it in the calculation
  if (issue.stakeholderRelevance) {
    importanceScore = (importanceScore + issue.stakeholderRelevance) / 2;
  }
  
  return importanceScore;
};

const MaterialityMatrixChart: React.FC<MaterialityMatrixChartProps> = ({ issues }) => {
  // Process data for the chart
  const chartData = issues.map(issue => {
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

  // Group data by ESG category
  const environmentalIssues = chartData.filter(d => d.category === 'environmental');
  const socialIssues = chartData.filter(d => d.category === 'social');
  const governanceIssues = chartData.filter(d => d.category === 'governance');

  // Colors for each category
  const categoryColors = {
    environmental: "#22c55e", // Green
    social: "#f97316",        // Orange
    governance: "#9b87f5"     // Purple
  };

  // Tooltip for displaying detailed information
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const categoryColor = categoryColors[data.category as keyof typeof categoryColors];
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
          <h4 className="font-semibold text-gray-900 mb-1" style={{ color: categoryColor }}>{data.name}</h4>
          <div className="bg-gray-50 p-2 rounded mb-2">
            <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Rilevanza dell'impatto:</span> {data.y}%</p>
            <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Rilevanza finanziaria:</span> {data.x}%</p>
            {data.stakeholderRelevance > 0 && (
              <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Rilevanza stakeholder:</span> {data.stakeholderRelevance}%</p>
            )}
            <p className="text-sm text-gray-700"><span className="font-medium">Importanza complessiva:</span> {Math.round(data.z)}%</p>
          </div>
          <div className="flex items-center">
            <span className={`h-3 w-3 rounded-full mr-2`} style={{ backgroundColor: categoryColor }}></span>
            <span className="text-xs font-medium capitalize">{data.category}</span>
            {data.isMaterial && (
              <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Materiale</span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend with colored dots for ESG categories
  const CustomLegend = () => (
    <div className="flex justify-center mt-2 space-x-6">
      <div className="flex items-center">
        <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: categoryColors.environmental }}></span>
        <span className="text-sm">Environmental</span>
      </div>
      <div className="flex items-center">
        <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: categoryColors.social }}></span>
        <span className="text-sm">Social</span>
      </div>
      <div className="flex items-center">
        <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: categoryColors.governance }}></span>
        <span className="text-sm">Governance</span>
      </div>
    </div>
  );

  // Background colors for the matrix quadrants
  const backgroundStyles = {
    container: {
      position: 'relative' as 'relative',
      width: '100%',
      height: '500px',
    },
    backgroundQuadrants: {
      position: 'absolute' as 'absolute',
      top: '60px',
      left: '60px',
      right: '30px',
      bottom: '50px',
      zIndex: 0,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
    },
    topRight: {
      backgroundColor: 'rgba(254, 243, 199, 0.3)', // Amber-50 with opacity
      borderTopRightRadius: '8px',
    },
    topLeft: {
      backgroundColor: 'rgba(254, 243, 199, 0.1)', // Amber-50 with less opacity
    },
    bottomRight: {
      backgroundColor: 'rgba(254, 243, 199, 0.15)', // Amber-50 with medium opacity
      borderBottomRightRadius: '8px',
    },
    bottomLeft: {
      backgroundColor: 'rgba(254, 243, 199, 0.05)', // Amber-50 with very little opacity
      borderBottomLeftRadius: '8px',
    },
  };

  return (
    <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Matrice di Materialità</h3>
      
      <div style={backgroundStyles.container}>
        <div style={backgroundStyles.backgroundQuadrants}>
          <div style={backgroundStyles.topLeft}></div>
          <div style={backgroundStyles.topRight}></div>
          <div style={backgroundStyles.bottomLeft}></div>
          <div style={backgroundStyles.bottomRight}></div>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 30, bottom: 30, left: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Rilevanza finanziaria" 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickCount={5}
              tickFormatter={(value) => {
                if (value === 0) return 'Negligible';
                if (value === 25) return 'Marginal';
                if (value === 50) return 'Moderate';
                if (value === 75) return 'Substantial';
                if (value === 100) return 'Severe';
                return '';
              }}
            >
              <Label value="Impact on Company Value - Financial Materiality" offset={-10} position="insideBottom" style={{ fontSize: 12, fill: '#64748b' }} />
            </XAxis>
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Rilevanza dell'impatto" 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickCount={5}
              tickFormatter={(value) => {
                if (value === 0) return 'Negligible';
                if (value === 25) return 'Marginal';
                if (value === 50) return 'Moderate';
                if (value === 75) return 'Substantial';
                if (value === 100) return 'Severe';
                return '';
              }}
            >
              <Label angle={-90} value="Impact on People and Environment - Impact Materiality" position="insideLeft" style={{ textAnchor: 'middle', fontSize: 12, fill: '#64748b' }} />
            </YAxis>
            <ZAxis
              type="number"
              dataKey="z"
              range={[100, 400]} // Modified range to increase bubble sizes
              name="Importanza"
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Environmental issues */}
            <Scatter
              name="Environmental"
              data={environmentalIssues}
              fill={categoryColors.environmental}
              opacity={0.8}
            />
            
            {/* Social issues */}
            <Scatter
              name="Social"
              data={socialIssues}
              fill={categoryColors.social}
              opacity={0.8}
            />
            
            {/* Governance issues */}
            <Scatter
              name="Governance"
              data={governanceIssues}
              fill={categoryColors.governance}
              opacity={0.8}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <CustomLegend />
    </div>
  );
};

export default MaterialityMatrixChart;
