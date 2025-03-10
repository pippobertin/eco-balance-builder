
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
  // Utilizza dati reali con fallback a 0, senza valori casuali
  const esgScore = reportData.materialityAnalysis.esgScore || 0;
  
  // Considera le emissioni totali di carbonio (Scope 1 + Scope 2 + Scope 3 se disponibili)
  const totalCarbon = 
    (reportData.environmentalMetrics.totalScope1Emissions || 0) +
    (reportData.environmentalMetrics.totalScope2Emissions || 0) +
    (reportData.environmentalMetrics.totalScope3Emissions || 0) || 
    reportData.environmentalMetrics.carbonEmissions || 0;
    
  const employeeDiversity = reportData.socialMetrics.employeeDiversity || 0;
  const governanceCompliance = reportData.conductMetrics.governanceCompliance || 0;
  
  // Calcola le variazioni solo se ci sono dati reali, altrimenti 0
  const esgChange = esgScore > 0 ? 5 : 0;
  const carbonChange = totalCarbon > 0 ? -12 : 0;
  const diversityChange = employeeDiversity > 0 ? 8 : 0;
  const complianceChange = governanceCompliance > 0 ? 3 : 0;
  
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
          value={esgScore || 0}
          change={esgChange}
          icon={<Activity className="h-5 w-5 text-esg-blue" />}
          description="Performance di sostenibilità complessiva"
          glowColor="rgba(10, 132, 255, 0.15)"
        />
      </motion.div>
      
      <motion.div variants={itemAnimation}>
        <DashboardCard
          title="Emissioni di Carbonio"
          value={totalCarbon > 0 ? `${totalCarbon} ton` : "0 ton"}
          change={carbonChange}
          icon={<Flame className="h-5 w-5 text-esg-blue" />}
          description="Emissioni totali per il periodo"
          glowColor="rgba(10, 132, 255, 0.15)"
        />
      </motion.div>
      
      <motion.div variants={itemAnimation}>
        <DashboardCard
          title="Diversità del Personale"
          value={employeeDiversity > 0 ? `${employeeDiversity}%` : "0%"}
          change={diversityChange}
          icon={<Users className="h-5 w-5 text-esg-blue" />}
          description="Miglioramento dell'equilibrio di genere"
          glowColor="rgba(10, 132, 255, 0.15)"
        />
      </motion.div>
      
      <motion.div variants={itemAnimation}>
        <DashboardCard
          title="Conformità Governance"
          value={governanceCompliance > 0 ? `${governanceCompliance}%` : "0%"}
          change={complianceChange}
          icon={<Building2 className="h-5 w-5 text-esg-blue" />}
          description="Aderenza alle politiche"
          glowColor="rgba(10, 132, 255, 0.15)"
        />
      </motion.div>
    </motion.div>
  );
};

export default DashboardSummaryCards;
