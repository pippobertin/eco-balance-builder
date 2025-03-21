import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MetricChart from '@/components/dashboard/MetricChart';

interface PollutionChartProps {
  reportId?: string;
}

interface PollutantData {
  medium: string;
  count: number;
  totalQuantity: number;
}

const PollutionChart: React.FC<PollutionChartProps> = ({ reportId }) => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<PollutantData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (reportId) {
      loadPollutionData();
    } else {
      setIsLoading(false);
    }
  }, [reportId]);

  const loadPollutionData = async () => {
    setIsLoading(true);
    try {
      // Fetch pollution records
      const { data: pollutionRecords, error: recordsError } = await supabase
        .from('pollution_records')
        .select('quantity, release_medium_id')
        .eq('report_id', reportId);

      if (recordsError) throw recordsError;

      if (!pollutionRecords || pollutionRecords.length === 0) {
        setChartData([]);
        setIsLoading(false);
        return;
      }

      // Fetch release mediums for names
      const { data: mediums, error: mediumsError } = await supabase
        .from('pollution_release_mediums')
        .select('id, name');

      if (mediumsError) throw mediumsError;

      // Create a map of medium ids to names
      const mediumMap = new Map();
      mediums?.forEach(medium => {
        mediumMap.set(medium.id, medium.name);
      });

      // Aggregate data by medium
      const aggregatedData = pollutionRecords.reduce((acc: Record<string, PollutantData>, record) => {
        const mediumName = mediumMap.get(record.release_medium_id) || 'Sconosciuto';
        
        if (!acc[mediumName]) {
          acc[mediumName] = {
            medium: mediumName,
            count: 0,
            totalQuantity: 0
          };
        }
        
        acc[mediumName].count += 1;
        acc[mediumName].totalQuantity += Number(record.quantity) || 0;
        
        return acc;
      }, {});

      // Convert to array for chart
      const chartDataArray = Object.values(aggregatedData);
      setChartData(chartDataArray);
    } catch (error) {
      console.error('Error loading pollution data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create formatted data for the chart
  const formattedData = chartData.map(item => ({
    name: item.medium,
    value: item.totalQuantity,
    count: item.count
  }));

  return (
    <MetricChart
      title="B4 - Inquinamento"
      description="Inquinanti per media di rilascio"
      type="bar"
      data={chartData}
      dataKey="value"
      categories={["value"]}
      colors={['#FF3B30', '#FF9500', '#5AC8FA']}
      individualColors={true}
      isLoading={isLoading}
      onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'pollution' } })}
      emptyStateMessage="Nessun dato sull'inquinamento disponibile"
    />
  );
};

export default PollutionChart;
