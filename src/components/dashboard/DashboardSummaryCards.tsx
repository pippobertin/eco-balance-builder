
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Users, Building2 } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { ReportData } from '@/context/types';

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
  // Check if we have real data with explicit type checking
  const hasEsgScore = reportData.materialityAnalysis && 
                     typeof reportData.materialityAnalysis.esgScore === 'number' && 
                     reportData.materialityAnalysis.esgScore > 0;
  
  // Calculate carbon emissions by scope
  let totalScope1 = 0;
  let totalScope2 = 0;
  let totalScope3 = 0;
  let totalCarbon = 0;
  
  if (reportData.environmentalMetrics) {
    if (typeof reportData.environmentalMetrics.totalScope1Emissions === 'number') {
      totalScope1 = reportData.environmentalMetrics.totalScope1Emissions;
      totalCarbon += totalScope1;
    }
    if (typeof reportData.environmentalMetrics.totalScope2Emissions === 'number') {
      totalScope2 = reportData.environmentalMetrics.totalScope2Emissions;
      totalCarbon += totalScope2;
    }
    if (typeof reportData.environmentalMetrics.totalScope3Emissions === 'number') {
      totalScope3 = reportData.environmentalMetrics.totalScope3Emissions;
      totalCarbon += totalScope3;
    }
  }
  
  // Check if any carbon data exists
  const hasCarbonData = totalCarbon > 0;
  
  // Format the description for carbon emissions
  const formatCarbonDescription = () => {
    if (!hasCarbonData) return "Nessun dato disponibile";
    
    let description = "Emissioni totali: ";
    const scopeItems = [];
    
    if (totalScope1 > 0) scopeItems.push(`Scope 1: ${totalScope1} ton`);
    if (totalScope2 > 0) scopeItems.push(`Scope 2: ${totalScope2} ton`);
    if (totalScope3 > 0) scopeItems.push(`Scope 3: ${totalScope3} ton`);
    
    return description + scopeItems.join(", ");
  };
  
  // Check if we have diversity data
  const hasDiversityData = reportData.socialMetrics && 
                          typeof reportData.socialMetrics.employeeDiversity === 'number' && 
                          reportData.socialMetrics.employeeDiversity > 0;
  
  // Check if we have governance data
  const hasGovernanceData = reportData.conductMetrics && 
                           typeof reportData.conductMetrics.governanceCompliance === 'number' && 
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
          value={hasCarbonData ? `${totalCarbon} ton` : "N/D"}
          change={0}
          icon={<Flame className="h-5 w-5 text-esg-blue" />}
          description={formatCarbonDescription()}
          glowColor="rgba(255, 69, 58, 0.15)"
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
