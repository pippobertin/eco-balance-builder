
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import { MaterialityIssue } from './types';

interface MaterialityMatrixChartProps {
  issues: MaterialityIssue[];
}

const MaterialityMatrixChart: React.FC<MaterialityMatrixChartProps> = ({ issues }) => {
  const chartData = issues.map(issue => ({
    name: issue.name,
    x: issue.financialRelevance,
    y: issue.impactRelevance,
    z: issue.stakeholderRelevance || 50, // Use stakeholder relevance for bubble size, default to 50 if not set
    isMaterial: issue.isMaterial
  }));

  return (
    <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Matrice di Materialità</h3>
      <ScatterChart
        width={800}
        height={400}
        margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          dataKey="x" 
          name="Rilevanza finanziaria" 
          domain={[0, 100]}
          tickCount={6}
        >
          <Label value="Rilevanza finanziaria" offset={-10} position="insideBottom" />
        </XAxis>
        <YAxis 
          type="number" 
          dataKey="y" 
          name="Rilevanza dell'impatto" 
          domain={[0, 100]}
          tickCount={6}
        >
          <Label value="Rilevanza dell'impatto" angle={-90} position="insideLeft" offset={10} />
        </YAxis>
        <ZAxis
          type="number"
          dataKey="z"
          range={[50, 250]}
          name="Rilevanza stakeholder"
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                  <p className="font-medium">{data.name}</p>
                  <p className="text-sm text-gray-600">Rilevanza finanziaria: {data.x}%</p>
                  <p className="text-sm text-gray-600">Rilevanza dell'impatto: {data.y}%</p>
                  {data.z !== 50 && (
                    <p className="text-sm text-gray-600">Rilevanza stakeholder: {data.z}%</p>
                  )}
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Scatter
          name="Questioni non materiali"
          data={chartData.filter(d => !d.isMaterial)}
          fill="#94a3b8"
          opacity={0.6}
        />
        <Scatter
          name="Questioni materiali"
          data={chartData.filter(d => d.isMaterial)}
          fill="#22c55e"
          opacity={0.8}
        />
      </ScatterChart>
    </div>
  );
};

export default MaterialityMatrixChart;
