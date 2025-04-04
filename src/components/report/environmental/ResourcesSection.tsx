
import React, { useState, useEffect } from 'react';
import { Recycle, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import WasteManagementTable from './resources/WasteManagementTable';
import { useReport } from '@/hooks/use-report-context';
import CircularEconomyDetails from './resources/components/CircularEconomyDetails';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';

interface ResourcesSectionProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  formValues,
  setFormValues
}) => {
  const { currentReport, needsSaving, lastSaved, saveCurrentReport } = useReport();
  const reportId = currentReport?.id;
  const [localLastSaved, setLocalLastSaved] = useState<Date | null>(lastSaved);

  // Sync with global last saved timestamp when it changes
  useEffect(() => {
    if (lastSaved) {
      setLocalLastSaved(lastSaved);
    }
  }, [lastSaved]);

  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <Recycle className="mr-2 h-5 w-5 text-green-500" />
        <h3 className="text-xl font-semibold">B7 - Uso delle risorse, economia circolare e gestione dei rifiuti</h3>
      </div>
      
      <div className="flex justify-end mb-4">
        <AutoSaveIndicator 
          needsSaving={needsSaving} 
          lastSaved={localLastSaved}
          className="w-full" 
        />
      </div>
      
      <div className="space-y-4 mt-6">
        <div className="p-4 rounded-md mb-4 bg-green-100">
          <div className="flex items-start">
            <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
            <p className="text-sm text-slate-600">
              Indica come gestisci l'uso delle risorse, le pratiche di gestione dei rifiuti e se applichi i principi dell'economia circolare.
              L'economia circolare si basa su tre principi: eliminare gli sprechi e l'inquinamento, circolazione dei prodotti e dei materiali al loro massimo valore, rigenerare la natura.
            </p>
          </div>
        </div>
        
        {/* Tabella dei rifiuti */}
        <WasteManagementTable formValues={formValues} handleChange={setFormValues} />
        
        {/* Dettagli economia circolare */}
        <CircularEconomyDetails 
          reportId={reportId} 
          onSaveComplete={(date) => setLocalLastSaved(date)} 
        />
      </div>
    </GlassmorphicCard>
  );
};

export default ResourcesSection;
