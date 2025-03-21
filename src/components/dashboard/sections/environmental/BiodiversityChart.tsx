
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MetricChart from '@/components/dashboard/MetricChart';

interface BiodiversityChartProps {
  reportId?: string;
}

const BiodiversityChart: React.FC<BiodiversityChartProps> = ({ reportId }) => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<any[]>([]);
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
      // Fetch biodiversity data for the report
      const { data, error } = await supabase
        .from('biodiversity_land_use')
        .select('*')
        .eq('report_id', reportId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        const chartItems = [];
        
        if (data.current_total_land_use !== null) {
          chartItems.push({
            name: 'Uso Totale\nTerreno',
            value: Number(data.current_total_land_use),
            previousValue: data.previous_total_land_use ? Number(data.previous_total_land_use) : undefined
          });
        }
        
        if (data.current_impermeable_surface !== null) {
          chartItems.push({
            name: 'Superficie\nImpermeabilizzata',
            value: Number(data.current_impermeable_surface),
            previousValue: data.previous_impermeable_surface ? Number(data.previous_impermeable_surface) : undefined
          });
        }
        
        if (data.current_nature_surface_onsite !== null) {
          chartItems.push({
            name: 'Sup. Naturale\nIn Sito',
            value: Number(data.current_nature_surface_onsite),
            previousValue: data.previous_nature_surface_onsite ? Number(data.previous_nature_surface_onsite) : undefined
          });
        }
        
        if (data.current_nature_surface_offsite !== null) {
          chartItems.push({
            name: 'Sup. Naturale\nFuori Sito',
            value: Number(data.current_nature_surface_offsite),
            previousValue: data.previous_nature_surface_offsite ? Number(data.previous_nature_surface_offsite) : undefined
          });
        }
        
        setChartData(chartItems);
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.error('Error loading biodiversity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MetricChart
      title="B5 - Biodiversità"
      description="Uso del suolo e superficie (ettari)"
      type={chartData.length > 0 ? "bar" : "empty"}
      data={chartData}
      dataKey="name"
      categories={["value"]}
      colors={['#FF9500', '#FF3B30', '#34C759', '#30D158']}
      individualColors={true}
      loading={isLoading}
      onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'biodiversity' } })}
      emptyStateMessage="Nessun dato sulla biodiversità registrato"
      compareKey="previousValue"
      categoryNames={["Anno corrente", "Anno precedente"]}
    />
  );
};

export default BiodiversityChart;
