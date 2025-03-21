
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MetricChart from '@/components/dashboard/MetricChart';

interface BiodiversityChartProps {
  reportId?: string;
}

interface BiodiversityData {
  category: string;
  currentValue: number;
  previousValue: number;
  change: number;
}

const BiodiversityChart: React.FC<BiodiversityChartProps> = ({ reportId }) => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<BiodiversityData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (reportId) {
      loadBiodiversityData();
    } else {
      setIsLoading(false);
    }
  }, [reportId]);

  const loadBiodiversityData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('biodiversity_land_use')
        .select('*')
        .eq('report_id', reportId)
        .single();

      if (error) throw error;

      if (data) {
        // Create formatted data structure for the chart
        const chartDataArray: BiodiversityData[] = [
          {
            category: "Superficie impermeabilizzata",
            currentValue: data.current_impermeable_surface || 0,
            previousValue: data.previous_impermeable_surface || 0,
            change: calculateChange(data.current_impermeable_surface, data.previous_impermeable_surface)
          },
          {
            category: "Superficie orientata alla natura (nel sito)",
            currentValue: data.current_nature_surface_onsite || 0,
            previousValue: data.previous_nature_surface_onsite || 0,
            change: calculateChange(data.current_nature_surface_onsite, data.previous_nature_surface_onsite)
          },
          {
            category: "Superficie orientata alla natura (fuori dal sito)",
            currentValue: data.current_nature_surface_offsite || 0,
            previousValue: data.previous_nature_surface_offsite || 0,
            change: calculateChange(data.current_nature_surface_offsite, data.previous_nature_surface_offsite)
          }
        ];
        
        setChartData(chartDataArray);
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.error('Error loading biodiversity data:', error);
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateChange = (current: number | null, previous: number | null): number => {
    if (!current || !previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Format data for the chart
  const formattedData = chartData.map(item => ({
    name: item.category,
    value: item.currentValue,
    compareValue: item.previousValue,
    change: item.change
  }));

  return (
    <MetricChart
      title="B5 - Biodiversità e uso del suolo"
      description="Superfici per tipologia e anno di riferimento"
      type={formattedData.length > 0 ? "bar" : "empty"}
      data={formattedData}
      dataKey="name"
      categories={["value"]}
      colors={['#34D399', '#60A5FA', '#A78BFA']}
      individualColors={true}
      isLoading={isLoading}
      onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'biodiversity' } })}
      emptyStateMessage="Nessun dato sulla biodiversità registrato"
      compareKey="compareValue"
      categoryNames={["Anno corrente", "Anno precedente"]}
    />
  );
};

export default BiodiversityChart;
