
import React from 'react';
import { Leaf, Users, Building2 } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/button';
import { ReportData } from '@/context/ReportContext';
import { useNavigate } from 'react-router-dom';

interface SustainabilityHighlightsProps {
  reportData: ReportData;
}

const SustainabilityHighlights: React.FC<SustainabilityHighlightsProps> = ({ reportData }) => {
  const navigate = useNavigate();
  
  const handleViewReport = () => {
    navigate('/report');
  };
  
  return (
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
  );
};

export default SustainabilityHighlights;
