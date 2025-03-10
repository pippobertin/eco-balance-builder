
import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users, Building2 } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/button';
import { ReportData } from '@/context/ReportContext';
import { useNavigate } from 'react-router-dom';

interface DashboardChartsProps {
  reportData: ReportData;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ reportData }) => {
  const navigate = useNavigate();
  
  const environmentalData = [
    { month: 'Gen', emissions: 120, waste: 65, energy: 45 },
    { month: 'Feb', emissions: 132, waste: 59, energy: 49 },
    { month: 'Mar', emissions: 101, waste: 80, energy: 40 },
    { month: 'Apr', emissions: 94, waste: 81, energy: 38 },
    { month: 'Mag', emissions: 85, waste: 56, energy: 35 },
    { month: 'Giu', emissions: 90, waste: 55, energy: 40 },
    { month: 'Lug', emissions: 97, waste: 66, energy: 45 },
    { month: 'Ago', emissions: 88, waste: 50, energy: 38 },
    { month: 'Set', emissions: 82, waste: 63, energy: 36 },
    { month: 'Ott', emissions: 78, waste: 59, energy: 35 },
    { month: 'Nov', emissions: 74, waste: 52, energy: 30 },
    { month: 'Dic', emissions: 70, waste: 48, energy: 28 },
  ];
  
  const socialData = [
    { 
      name: 'Diversità di Genere', 
      value: reportData.socialMetrics.employeeDiversity || 65 
    },
    { 
      name: 'Soddisfazione Dipendenti', 
      value: reportData.socialMetrics.employeeSatisfaction || 78 
    },
    { 
      name: 'Ore di Formazione', 
      value: reportData.socialMetrics.trainingHours || 89 
    },
    { 
      name: 'Impegno Comunitario', 
      value: reportData.socialMetrics.communityEngagement || 72 
    }
  ];
  
  const governanceData = [
    { 
      quarter: 'Q1', 
      compliance: reportData.conductMetrics.governanceCompliance || 85,
      risk: reportData.conductMetrics.riskManagement || 20,
      policy: reportData.conductMetrics.policyAdherence || 70
    },
    { quarter: 'Q2', compliance: 88, risk: 18, policy: 75 },
    { quarter: 'Q3', compliance: 92, risk: 15, policy: 80 },
    { quarter: 'Q4', compliance: 95, risk: 12, policy: 85 },
  ];
  
  const performanceData = [
    { 
      name: 'Ambientale', 
      value: reportData.environmentalMetrics.renewableEnergy ? 
        Math.round((reportData.environmentalMetrics.renewableEnergy + 100 - reportData.environmentalMetrics.carbonEmissions) / 2) : 75 
    },
    { 
      name: 'Sociale', 
      value: reportData.socialMetrics.employeeDiversity ? 
        Math.round((reportData.socialMetrics.employeeDiversity + reportData.socialMetrics.employeeSatisfaction) / 2) : 82 
    },
    { 
      name: 'Governance', 
      value: reportData.conductMetrics.governanceCompliance || 88 
    },
  ];
  
  const handleViewReport = () => {
    navigate('/report');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-bold mb-6">Suddivisione Performance ESG</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <MetricChart
          title="Performance Ambientale"
          description="Monitoraggio mensile degli indicatori ambientali chiave"
          type="area"
          data={environmentalData}
          dataKey="month"
          categories={['emissions', 'waste', 'energy']}
          colors={['#0A84FF', '#34C759', '#5AC8FA']}
        />
        
        <MetricChart
          title="Iniziative Sociali"
          description="Performance nelle dimensioni sociali"
          type="bar"
          data={socialData}
          dataKey="name"
          categories={['value']}
          colors={['#FF9500']}
        />
        
        <MetricChart
          title="Metriche di Governance"
          description="Performance di governance trimestrale"
          type="area"
          data={governanceData}
          dataKey="quarter"
          categories={['compliance', 'risk', 'policy']}
          colors={['#64D2FF', '#FF2D55', '#BF5AF2']}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricChart
          title="Distribuzione Punteggio ESG"
          description="Performance nelle dimensioni ESG"
          type="pie"
          data={performanceData}
          dataKey="name"
          colors={['#30D158', '#FF9F0A', '#5E5CE6']}
        />
        
        <GlassmorphicCard className="h-full">
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-medium mb-4">Punti Salienti Sostenibilità</h3>
            
            <div className="space-y-4 flex-grow">
              <div className="p-4 bg-esg-blue/10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Leaf className="h-5 w-5 text-esg-blue mt-0.5" />
                  <div>
                    <h4 className="font-medium">Riduzione Carbonio</h4>
                    <p className="text-sm text-esg-gray-medium">
                      {reportData.environmentalMetrics.carbonEmissions 
                        ? `Emissioni di carbonio attuali: ${reportData.environmentalMetrics.carbonEmissions} tonnellate`
                        : "Riduzione delle emissioni di carbonio del 12% attraverso iniziative di energia rinnovabile."}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-esg-blue/10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-esg-blue mt-0.5" />
                  <div>
                    <h4 className="font-medium">Programma Diversità</h4>
                    <p className="text-sm text-esg-gray-medium">
                      {reportData.socialMetrics.employeeDiversity 
                        ? `Diversità attuale del personale: ${reportData.socialMetrics.employeeDiversity}%`
                        : "Implementato nuovo programma di assunzioni per la diversità, aumentando la diversità della forza lavoro dell'8%."}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-esg-blue/10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-esg-blue mt-0.5" />
                  <div>
                    <h4 className="font-medium">Aggiornamento Governance</h4>
                    <p className="text-sm text-esg-gray-medium">
                      {reportData.conductMetrics.governanceCompliance 
                        ? `Tasso di conformità attuale: ${reportData.conductMetrics.governanceCompliance}%`
                        : "Politiche di conformità aggiornate con un tasso di aderenza del 95%."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                className="w-full bg-esg-blue hover:bg-esg-blue/90"
                onClick={handleViewReport}
              >
                Visualizza Report Completo
              </Button>
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    </motion.div>
  );
};

export default DashboardCharts;
