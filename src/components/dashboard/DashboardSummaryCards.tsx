
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Users, Building2 } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { ReportData } from '@/context/ReportContext';

interface DashboardSummaryCardsProps {
  reportData: ReportData;
}

const staggerAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const DashboardSummaryCards: React.FC<DashboardSummaryCardsProps> = ({ reportData }) => {
  const esgScore = reportData.materialityAnalysis.esgScore || 82;
  const carbonEmissions = reportData.environmentalMetrics.carbonEmissions || 70;
  const employeeDiversity = reportData.socialMetrics.employeeDiversity || 65;
  const governanceCompliance = reportData.conductMetrics.governanceCompliance || 95;
  
  return (
    <motion.div
      variants={staggerAnimation}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <motion.div variants={itemAnimation}>
        <DashboardCard
          title="ESG Score"
          value={esgScore}
          change={5}
          icon={<Activity className="h-5 w-5 text-esg-blue" />}
          description="Overall sustainability performance"
          glowColor="rgba(10, 132, 255, 0.15)"
        />
      </motion.div>
      
      <motion.div variants={itemAnimation}>
        <DashboardCard
          title="Carbon Emissions"
          value={`${carbonEmissions} tons`}
          change={-12}
          icon={<Flame className="h-5 w-5 text-esg-blue" />}
          description="Total emissions for the period"
          glowColor="rgba(10, 132, 255, 0.15)"
        />
      </motion.div>
      
      <motion.div variants={itemAnimation}>
        <DashboardCard
          title="Workforce Diversity"
          value={`${employeeDiversity}%`}
          change={8}
          icon={<Users className="h-5 w-5 text-esg-blue" />}
          description="Gender balance improvement"
          glowColor="rgba(10, 132, 255, 0.15)"
        />
      </motion.div>
      
      <motion.div variants={itemAnimation}>
        <DashboardCard
          title="Governance Compliance"
          value={`${governanceCompliance}%`}
          change={3}
          icon={<Building2 className="h-5 w-5 text-esg-blue" />}
          description="Adherence to policies"
          glowColor="rgba(10, 132, 255, 0.15)"
        />
      </motion.div>
    </motion.div>
  );
};

export default DashboardSummaryCards;
