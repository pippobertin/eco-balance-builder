
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';

interface GenderDistributionChartProps {
  maleEmployees?: number;
  femaleEmployees?: number;
  otherGenderEmployees?: number;
}

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({
  maleEmployees,
  femaleEmployees,
  otherGenderEmployees
}) => {
  // Prepare data for gender distribution chart
  const genderData = [];
  
  if (maleEmployees || femaleEmployees || otherGenderEmployees) {
    if (maleEmployees) {
      genderData.push({
        name: 'Uomini',
        value: typeof maleEmployees === 'number' ? maleEmployees : 
               typeof maleEmployees === 'string' ? parseInt(maleEmployees, 10) || 0 : 0
      });
    }
    
    if (femaleEmployees) {
      genderData.push({
        name: 'Donne',
        value: typeof femaleEmployees === 'number' ? femaleEmployees : 
               typeof femaleEmployees === 'string' ? parseInt(femaleEmployees, 10) || 0 : 0
      });
    }
    
    if (otherGenderEmployees) {
      genderData.push({
        name: 'Altro',
        value: typeof otherGenderEmployees === 'number' ? otherGenderEmployees : 
               typeof otherGenderEmployees === 'string' ? parseInt(otherGenderEmployees, 10) || 0 : 0
      });
    }
  }

  return (
    <MetricChart
      title="Composizione di Genere"
      description="Distribuzione dei dipendenti per genere"
      type={genderData.length > 0 ? "bar" : "empty"}
      data={genderData}
      dataKey="name"
      categories={["value"]}
      colors={["#0EA5E9", "#FFDEE2", "#BF5AF2"]} 
      // Azzurro per uomini, Rosa per donne, Viola per altro
    />
  );
};

export default GenderDistributionChart;
