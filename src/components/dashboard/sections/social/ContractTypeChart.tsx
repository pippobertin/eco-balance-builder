
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';

interface ContractTypeChartProps {
  permanentEmployees?: number;
  temporaryEmployees?: number;
}

const ContractTypeChart: React.FC<ContractTypeChartProps> = ({
  permanentEmployees,
  temporaryEmployees
}) => {
  // Prepare data for contract type chart
  const contractData = [];
  
  if (permanentEmployees || temporaryEmployees) {
    if (permanentEmployees) {
      contractData.push({
        name: 'Dipendenti a Tempo Indeterminato',
        value: typeof permanentEmployees === 'number' ? permanentEmployees : 
               typeof permanentEmployees === 'string' ? parseInt(permanentEmployees, 10) || 0 : 0
      });
    }
    
    if (temporaryEmployees) {
      contractData.push({
        name: 'Dipendenti a Tempo Determinato',
        value: typeof temporaryEmployees === 'number' ? temporaryEmployees : 
               typeof temporaryEmployees === 'string' ? parseInt(temporaryEmployees, 10) || 0 : 0
      });
    }
  }

  return (
    <MetricChart
      title="Tipo di Contratto"
      description="Distribuzione per tipo di contratto"
      type={contractData.length > 0 ? "bar" : "empty"}
      data={contractData}
      dataKey="name"
      categories={["value"]}
      colors={["#34C759", "#FF9500"]}
    />
  );
};

export default ContractTypeChart;
