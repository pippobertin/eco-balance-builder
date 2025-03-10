
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
  
  // Crea dati ambientali con valori reali o zero
  const environmentalData = [
    { month: 'Gen', emissions: 0, waste: 0, energy: 0 },
    { month: 'Feb', emissions: 0, waste: 0, energy: 0 },
    { month: 'Mar', emissions: 0, waste: 0, energy: 0 },
    { month: 'Apr', emissions: 0, waste: 0, energy: 0 },
    { month: 'Mag', emissions: 0, waste: 0, energy: 0 },
    { month: 'Giu', emissions: 0, waste: 0, energy: 0 },
    { month: 'Lug', emissions: 0, waste: 0, energy: 0 },
    { month: 'Ago', emissions: 0, waste: 0, energy: 0 },
    { month: 'Set', emissions: 0, waste: 0, energy: 0 },
    { month: 'Ott', emissions: 0, waste: 0, energy: 0 },
    { month: 'Nov', emissions: 0, waste: 0, energy: 0 },
    { month: 'Dic', emissions: 0, waste: 0, energy: 0 },
  ];
  
  // Usa solo i dati effettivamente disponibili
  if (reportData.environmentalMetrics.carbonEmissions) {
    environmentalData[11].emissions = reportData.environmentalMetrics.carbonEmissions;
  }
  if (reportData.environmentalMetrics.wasteGeneration) {
    environmentalData[11].waste = reportData.environmentalMetrics.wasteGeneration;
  }
  if (reportData.environmentalMetrics.energyConsumption) {
    environmentalData[11].energy = reportData.environmentalMetrics.energyConsumption / 30;
  }
  
  // Crea dati sociali solo con valori realmente disponibili
  const socialData = [
    { 
      name: 'Diversità di Genere', 
      value: reportData.socialMetrics.employeeDiversity || 0 
    },
    { 
      name: 'Soddisfazione Dipendenti', 
      value: reportData.socialMetrics.employeeSatisfaction || 0 
    },
    { 
      name: 'Ore di Formazione', 
      value: reportData.socialMetrics.trainingHours || 0 
    },
    { 
      name: 'Impegno Comunitario', 
      value: reportData.socialMetrics.communityEngagement || 0 
    }
  ];
  
  // Crea dati di governance solo con valori realmente disponibili
  const governanceData = [
    { 
      quarter: 'Q1', 
      compliance: reportData.conductMetrics.governanceCompliance || 0,
      risk: reportData.conductMetrics.riskManagement || 0,
      policy: reportData.conductMetrics.policyAdherence || 0
    },
    { quarter: 'Q2', compliance: 0, risk: 0, policy: 0 },
    { quarter: 'Q3', compliance: 0, risk: 0, policy: 0 },
    { quarter: 'Q4', compliance: 0, risk: 0, policy: 0 },
  ];
  
  // Usa solo valori reali per i dati di performance
  const performanceData = [
    { 
      name: 'Ambientale', 
      value: reportData.environmentalMetrics.carbonEmissions > 0 || 
             reportData.environmentalMetrics.renewableEnergy > 0 ? 
             Math.round((reportData.environmentalMetrics.renewableEnergy || 0) + 
                        (100 - (reportData.environmentalMetrics.carbonEmissions || 0))) / 2 : 0 
    },
    { 
      name: 'Sociale', 
      value: reportData.socialMetrics.employeeDiversity > 0 || 
             reportData.socialMetrics.employeeSatisfaction > 0 ? 
             Math.round((reportData.socialMetrics.employeeDiversity || 0) + 
                        (reportData.socialMetrics.employeeSatisfaction || 0)) / 2 : 0 
    },
    { 
      name: 'Governance', 
      value: reportData.conductMetrics.governanceCompliance || 0 
    },
  ];
  
  const handleViewReport = () => {
    navigate('/report');
  };
  
  // Verifica se ci sono dati per ogni categoria
  const hasEnvironmentalData = reportData.environmentalMetrics.carbonEmissions > 0 || 
                              reportData.environmentalMetrics.wasteGeneration > 0 || 
                              reportData.environmentalMetrics.energyConsumption > 0;
                              
  const hasSocialData = reportData.socialMetrics.employeeDiversity > 0 || 
                        reportData.socialMetrics.employeeSatisfaction > 0 || 
                        reportData.socialMetrics.trainingHours > 0 || 
                        reportData.socialMetrics.communityEngagement > 0;
                        
  const hasGovernanceData = reportData.conductMetrics.governanceCompliance > 0 || 
                            reportData.conductMetrics.policyAdherence > 0 || 
                            reportData.conductMetrics.riskManagement > 0;

  const hasPerformanceData = performanceData.some(item => item.value > 0);
  
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
          description={hasEnvironmentalData ? 
            "Monitoraggio mensile degli indicatori ambientali chiave" : 
            "Nessun dato ambientale disponibile"}
          type="area"
          data={environmentalData}
          dataKey="month"
          categories={['emissions', 'waste', 'energy']}
          colors={['#0A84FF', '#34C759', '#5AC8FA']}
        />
        
        <MetricChart
          title="Iniziative Sociali"
          description={hasSocialData ? 
            "Performance nelle dimensioni sociali" : 
            "Nessun dato sociale disponibile"}
          type="bar"
          data={socialData}
          dataKey="name"
          categories={['value']}
          colors={['#FF9500']}
        />
        
        <MetricChart
          title="Metriche di Governance"
          description={hasGovernanceData ? 
            "Performance di governance trimestrale" : 
            "Nessun dato di governance disponibile"}
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
          description={hasPerformanceData ? 
            "Performance nelle dimensioni ESG" : 
            "Nessun dato di performance ESG disponibile"}
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
                      {reportData.environmentalMetrics.carbonEmissions > 0
                        ? `Emissioni di carbonio attuali: ${reportData.environmentalMetrics.carbonEmissions} tonnellate`
                        : "Nessun dato disponibile sulle emissioni di carbonio."}
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
                      {reportData.socialMetrics.employeeDiversity > 0
                        ? `Diversità attuale del personale: ${reportData.socialMetrics.employeeDiversity}%`
                        : "Nessun dato disponibile sulla diversità del personale."}
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
                      {reportData.conductMetrics.governanceCompliance > 0
                        ? `Tasso di conformità attuale: ${reportData.conductMetrics.governanceCompliance}%`
                        : "Nessun dato disponibile sulla conformità di governance."}
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
