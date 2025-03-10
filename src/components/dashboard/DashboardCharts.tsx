
import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users, Building2 } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/button';

const DashboardCharts = () => {
  const environmentalData = [
    { month: 'Jan', emissions: 120, waste: 65, energy: 45 },
    { month: 'Feb', emissions: 132, waste: 59, energy: 49 },
    { month: 'Mar', emissions: 101, waste: 80, energy: 40 },
    { month: 'Apr', emissions: 94, waste: 81, energy: 38 },
    { month: 'May', emissions: 85, waste: 56, energy: 35 },
    { month: 'Jun', emissions: 90, waste: 55, energy: 40 },
    { month: 'Jul', emissions: 97, waste: 66, energy: 45 },
    { month: 'Aug', emissions: 88, waste: 50, energy: 38 },
    { month: 'Sep', emissions: 82, waste: 63, energy: 36 },
    { month: 'Oct', emissions: 78, waste: 59, energy: 35 },
    { month: 'Nov', emissions: 74, waste: 52, energy: 30 },
    { month: 'Dec', emissions: 70, waste: 48, energy: 28 },
  ];
  
  const socialData = [
    { name: 'Gender Diversity', value: 65 },
    { name: 'Employee Satisfaction', value: 78 },
    { name: 'Training Hours', value: 89 },
    { name: 'Community Engagement', value: 72 }
  ];
  
  const governanceData = [
    { quarter: 'Q1', compliance: 85, risk: 20, policy: 70 },
    { quarter: 'Q2', compliance: 88, risk: 18, policy: 75 },
    { quarter: 'Q3', compliance: 92, risk: 15, policy: 80 },
    { quarter: 'Q4', compliance: 95, risk: 12, policy: 85 },
  ];
  
  const performanceData = [
    { name: 'Environmental', value: 75 },
    { name: 'Social', value: 82 },
    { name: 'Governance', value: 88 },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-bold mb-6">ESG Performance Breakdown</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <MetricChart
          title="Environmental Performance"
          description="Monthly tracking of key environmental metrics"
          type="area"
          data={environmentalData}
          dataKey="month"
          categories={['emissions', 'waste', 'energy']}
          colors={['#0A84FF', '#34C759', '#5AC8FA']}
        />
        
        <MetricChart
          title="Social Initiatives"
          description="Performance across social dimensions"
          type="bar"
          data={socialData}
          dataKey="name"
          categories={['value']}
          colors={['#FF9500']}
        />
        
        <MetricChart
          title="Governance Metrics"
          description="Quarterly governance performance"
          type="area"
          data={governanceData}
          dataKey="quarter"
          categories={['compliance', 'risk', 'policy']}
          colors={['#64D2FF', '#FF2D55', '#BF5AF2']}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricChart
          title="Overall ESG Score Distribution"
          description="Performance across ESG dimensions"
          type="pie"
          data={performanceData}
          dataKey="name"
          colors={['#30D158', '#FF9F0A', '#5E5CE6']}
        />
        
        <GlassmorphicCard className="h-full">
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-medium mb-4">Sustainability Highlights</h3>
            
            <div className="space-y-4 flex-grow">
              <div className="p-4 bg-esg-blue/10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Leaf className="h-5 w-5 text-esg-blue mt-0.5" />
                  <div>
                    <h4 className="font-medium">Carbon Reduction</h4>
                    <p className="text-sm text-esg-gray-medium">Reduced carbon emissions by 12% through renewable energy initiatives.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-esg-blue/10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-esg-blue mt-0.5" />
                  <div>
                    <h4 className="font-medium">Diversity Program</h4>
                    <p className="text-sm text-esg-gray-medium">Implemented new diversity hiring program increasing workforce diversity by 8%.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-esg-blue/10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-esg-blue mt-0.5" />
                  <div>
                    <h4 className="font-medium">Governance Update</h4>
                    <p className="text-sm text-esg-gray-medium">Updated compliance policies achieving 95% adherence rate.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button className="w-full bg-esg-blue hover:bg-esg-blue/90">
                View Complete Report
              </Button>
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    </motion.div>
  );
};

export default DashboardCharts;
