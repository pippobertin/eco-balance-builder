
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer } from 'recharts';
import { MaterialityIssue } from './types';
import { categoryColors } from './utils/esgCategoryUtils';
import { processChartData, groupDataByCategory } from './utils/chartDataUtils';
import MaterialityTooltip from './components/MaterialityTooltip';
import MaterialityLegend from './components/MaterialityLegend';
import QuadrantBackground, { quadrantStyles } from './components/QuadrantBackground';

interface MaterialityMatrixChartProps {
  issues: MaterialityIssue[];
}

const MaterialityMatrixChart: React.FC<MaterialityMatrixChartProps> = ({ issues }) => {
  // Process data for the chart
  const chartData = processChartData(issues);

  // Group data by ESG category
  const { environmentalIssues, socialIssues, governanceIssues } = groupDataByCategory(chartData);

  return (
    <div className="w-full h-[600px] p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Matrice di Materialità</h3>
      
      <div style={quadrantStyles.container}>
        <QuadrantBackground />
        
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 40, bottom: 70, left: 100 }}
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
                if (value === 0) return 'Trascurabile';
                if (value === 25) return 'Marginale';
                if (value === 50) return 'Moderato';
                if (value === 75) return 'Sostanziale';
                if (value === 100) return 'Grave';
                return '';
              }}
            >
              <Label 
                value="Impatto sul Valore Aziendale - Materialità Finanziaria" 
                offset={-5} 
                position="insideBottom" 
                style={{ fontSize: 12, fill: '#64748b' }} 
              />
            </XAxis>
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Rilevanza dell'impatto" 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickCount={5}
              tickFormatter={(value) => {
                if (value === 0) return 'Trascurabile';
                if (value === 25) return 'Marginale';
                if (value === 50) return 'Moderato';
                if (value === 75) return 'Sostanziale';
                if (value === 100) return 'Grave';
                return '';
              }}
            >
              <Label 
                angle={-90} 
                value="Impatto su Persone e Ambiente - Materialità dell'Impatto" 
                position="insideLeft" 
                offset={25}
                style={{ textAnchor: 'middle', fontSize: 12, fill: '#64748b' }} 
              />
            </YAxis>
            <ZAxis
              type="number"
              dataKey="z"
              range={[400, 1200]}
              name="Importanza"
            />
            <Tooltip content={<MaterialityTooltip />} />
            
            {/* Environmental issues */}
            <Scatter
              name="Ambientale"
              data={environmentalIssues}
              fill={categoryColors.environmental}
              opacity={0.8}
            />
            
            {/* Social issues */}
            <Scatter
              name="Sociale"
              data={socialIssues}
              fill={categoryColors.social}
              opacity={0.8}
            />
            
            {/* Governance issues */}
            <Scatter
              name="Gestione"
              data={governanceIssues}
              fill={categoryColors.governance}
              opacity={0.8}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <MaterialityLegend />
    </div>
  );
};

export default MaterialityMatrixChart;
