
import React from 'react';
import { motion } from 'framer-motion';
import { ReportData } from '@/context/types';
import EnvironmentalChart from './charts/EnvironmentalChart';
import SocialChart from './charts/SocialChart';
import GovernanceChart from './charts/GovernanceChart';
import PerformanceDistributionChart from './charts/PerformanceDistributionChart';
import SustainabilityHighlights from './SustainabilityHighlights';

interface DashboardChartsProps {
  reportData: ReportData;
  companyName?: string;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ reportData, companyName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-baseline gap-2">
        Suddivisione Performance ESG
        {companyName && <span className="text-emerald-500 text-2xl font-bold">{companyName}</span>}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <EnvironmentalChart reportData={reportData} />
        <SocialChart reportData={reportData} />
        <GovernanceChart reportData={reportData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PerformanceDistributionChart reportData={reportData} />
        <SustainabilityHighlights reportData={reportData} />
      </div>
    </motion.div>
  );
};

export default DashboardCharts;
