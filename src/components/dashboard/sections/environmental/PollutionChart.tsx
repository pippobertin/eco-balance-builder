
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricChart from '@/components/dashboard/MetricChart';
import { supabase } from '@/integrations/supabase/client';

interface PollutionChartProps {
  reportId?: string;
}

const PollutionChart: React.FC<PollutionChartProps> = ({ reportId }) => {
  const navigate = useNavigate();
  const [pollutionData, setPollutionData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPollutionData = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      
      try {
        // Fetch pollution records
        const { data: records, error } = await supabase
          .from('pollution_records')
          .select(`
            quantity,
            pollutant_types(name),
            pollution_release_mediums(name)
          `)
          .eq('report_id', reportId);
        
        if (error) throw error;
        
        // Group pollution data by medium of release
        const groupedData: Record<string, number> = {};
        
        records?.forEach((record: any) => {
          const medium = record.pollution_release_mediums?.name;
          
          if (medium) {
            if (!groupedData[medium]) {
              groupedData[medium] = 0;
            }
            groupedData[medium] += Number(record.quantity) || 0;
          }
        });
        
        // Convert to chart format
        const chartData = Object.entries(groupedData).map(([name, value]) => ({
          name,
          value: parseFloat(value.toFixed(2))
        }));
        
        setPollutionData(chartData);
      } catch (error) {
        console.error('Error fetching pollution data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPollutionData();
  }, [reportId]);

  return (
    <MetricChart
      title="B4 - Inquinamento"
      description="Emissioni di inquinanti in aria, acqua e suolo"
      type={pollutionData.length > 0 ? "bar" : "empty"}
      data={pollutionData}
      dataKey="name"
      categories={["value"]}
      colors={['#5AC8FA', '#0EA5E9', '#8B5CF6']}
      individualColors={true}
      isLoading={isLoading}
      onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'pollution' } })}
    />
  );
};

export default PollutionChart;
