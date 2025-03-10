
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
  // Check if we have real data, don't use defaults
  const hasEsgScore = reportData.materialityAnalysis && reportData.materialityAnalysis.esgScore > 0;
  
  const totalCarbon = 
    (reportData.environmentalMetrics?.totalScope1Emissions || 0) +
    (reportData.environmentalMetrics?.totalScope2Emissions || 0) +
    (reportData.environmentalMetrics?.totalScope3Emissions || 0);
  
  // Check if we have diversity data
  const hasDiversityData = reportData.socialMetrics && 
                          reportData.socialMetrics.employeeDiversity !== undefined && 
                          reportData.socialMetrics.employeeDiversity > 0;
  
  // Check if we have governance data
  const hasGovernanceData = reportData.conductMetrics && 
                           reportData.conductMetrics.governanceCompliance !== undefined && 
                           reportData.conductMetrics.governanceCompliance > 0;
  
  return (
    <motion.div
      variants={staggerAnimation}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <motion.div variants={itemAnimation}>
        <DashboardCard
          title="Punteggio ESG"
          value={hasEsgScore ? reportData.materialityAnalysis.esgScore : "N/D"}
          change={0}
          icon={<Activity className="h-5 w-5 text-esg-blue" />}
          description={hasEsgScore ? "Performance di sostenibilità complessiva" : "Nessun dato disponibile"}
          glowColor="rgba(10, 132, 255, 0.15)"
        />
      </motion.div>
      
      <motion.div variants={itemAnimation}>
        <DashboardCard
          title="Emissioni di Carbonio"
          value={totalCarbon > 0 ? `${totalCarbon} ton` : "N/D"}
          change={0}
          icon={<Flame className="h-5 w-5 text-esg-blue" />}
          description={totalCarbon > 0 ? "Emissioni totali per il periodo" : "Nessun dato disponibile"}
          glowColor="rgba(10, 132, 255, 0.15)"
        />
      </motion.div>
      
      <motion.div variants={itemAnimation}>
        <DashboardCard
          title="Diversità del Personale"
          value={hasDiversityData ? `${reportData.socialMetrics.employeeDiversity}%` : "N/D"}
          change={0}
          icon={<Users className="h-5 w-5 text-esg-blue" />}
          description={hasDiversityData ? "Miglioramento dell'equilibrio di genere" : "Nessun dato disponibile"}
          glowColor="rgba(10, 132, 255, 0.15)"
        />
      </motion.div>
      
      <motion.div variants={itemAnimation}>
        <DashboardCard
          title="Conformità Governance"
          value={hasGovernanceData ? `${reportData.conductMetrics.governanceCompliance}%` : "N/D"}
          change={0}
          icon={<Building2 className="h-5 w-5 text-esg-blue" />}
          description={hasGovernanceData ? "Aderenza alle politiche" : "Nessun dato disponibile"}
          glowColor="rgba(10, 132, 255, 0.15)"
        />
      </motion.div>
    </motion.div>
  );
};

export default DashboardSummaryCards;
