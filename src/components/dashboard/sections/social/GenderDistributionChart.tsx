
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
  
  // Calculate total employees
  const totalMale = typeof maleEmployees === 'number' ? maleEmployees : 
                    typeof maleEmployees === 'string' ? parseInt(maleEmployees, 10) || 0 : 0;
                    
  const totalFemale = typeof femaleEmployees === 'number' ? femaleEmployees : 
                      typeof femaleEmployees === 'string' ? parseInt(femaleEmployees, 10) || 0 : 0;
                      
  const totalOther = typeof otherGenderEmployees === 'number' ? otherGenderEmployees : 
                     typeof otherGenderEmployees === 'string' ? parseInt(otherGenderEmployees, 10) || 0 : 0;
  
  const totalEmployees = totalMale + totalFemale + totalOther;
  
  // Format data for donut chart with multiple rings
  if (totalEmployees > 0) {
    // Create outer ring with gender distribution
    const outerRingData = [];
    
    if (totalMale > 0) {
      outerRingData.push({
        name: 'Uomini',
        value: totalMale
      });
    }
    
    if (totalFemale > 0) {
      outerRingData.push({
        name: 'Donne',
        value: totalFemale
      });
    }
    
    if (totalOther > 0) {
      outerRingData.push({
        name: 'Altro',
        value: totalOther
      });
    }
    
    // Add outer ring with gender distribution
    if (outerRingData.length > 0) {
      genderData.push({
        ring: 'outer',
        data: outerRingData,
        colors: ['#0EA5E9', '#F472B6', '#BF5AF2']
      });
    }
    
    // Create inner ring with total employees
    genderData.push({
      ring: 'inner',
      data: [{ name: 'Totale Dipendenti', value: totalEmployees }],
      colors: ['#8E9196'] // Neutral gray for total
    });
  }

  return (
    <MetricChart
      title="Composizione di Genere"
      description="Distribuzione dei dipendenti per genere"
      type={genderData.length > 0 ? "donut" : "empty"}
      data={genderData}
      dataKey="name"
      categories={["value"]}
      colors={["#0EA5E9", "#F472B6", "#BF5AF2"]}
      individualColors={true}
      hideLegend={false}
    />
  );
};

export default GenderDistributionChart;
