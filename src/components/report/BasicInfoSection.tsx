
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, FileText, CheckCircle2, Save } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useToast } from '@/hooks/use-toast';
import { Subsidiary } from '@/context/ReportContext';
import { Report } from '@/context/types';
import { useSustainabilityPractices } from './basic-info/hooks/useSustainabilityPractices';
interface BasicInfoSectionProps {
  isConsolidated: boolean;
  subsidiaries: Subsidiary[];
  currentReport: Report | null;
  sustainabilityPractices: string;
  setSustainabilityPractices: React.Dispatch<React.SetStateAction<string>>;
  newSubsidiary: Subsidiary;
  setNewSubsidiary: React.Dispatch<React.SetStateAction<Subsidiary>>;
  handleAddSubsidiary: () => void;
  removeSubsidiary: (index: number) => void;
  onContinue: () => void;
}
const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  isConsolidated,
  subsidiaries,
  currentReport,
  sustainabilityPractices,
  setSustainabilityPractices,
  newSubsidiary,
  setNewSubsidiary,
  handleAddSubsidiary,
  removeSubsidiary,
  onContinue
}) => {
  const {
    toast
  } = useToast();
  const containerAnimation = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Use our custom hook for sustainability practices
  const {
    practices,
    setPractices,
    isLoading,
    isSaving,
    savePractices
  } = useSustainabilityPractices({
    reportId: currentReport?.id
  });

  // Sync the practices from DB with the form state
  useEffect(() => {
    if (practices && practices !== sustainabilityPractices) {
      setSustainabilityPractices(practices);
    }
  }, [practices, setSustainabilityPractices]);

  // Handler for saving practices
  const handleSavePractices = async () => {
    await savePractices(sustainabilityPractices);
  };
  return <motion.div variants={containerAnimation} initial="hidden" animate="visible" className="space-y-6">
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Info className="mr-2 h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Informativa B 1 - Criteri per la redazione</h2>
        </div>
        
        <div className="p-4 rounded-md mb-4 bg-sky-800">
          <p className="text-sm text-slate-50">
            Hai selezionato: <strong>
              {currentReport?.report_type === 'A' ? 'OPZIONE A: Modulo Base' : currentReport?.report_type === 'B' ? 'OPZIONE B: Modulo Base e Modulo Narrativo-PAT' : currentReport?.report_type === 'C' ? 'OPZIONE C: Modulo Base e Modulo Partner commerciali' : currentReport?.report_type === 'D' ? 'OPZIONE D: Modulo Base, Modulo Narrativo-PAT e Modulo Partner commerciali' : 'Nessuna opzione selezionata'}
            </strong>
          </p>
          <p className="text-sm mt-2 text-slate-50">
            Tipo di relazione: <strong>{isConsolidated ? 'Consolidata' : 'Individuale'}</strong>
          </p>
          {isConsolidated && subsidiaries.length > 0 && <div className="mt-2">
              <p className="text-sm font-medium text-white">Imprese figlie incluse:</p>
              <ul className="list-disc pl-5 text-sm text-white">
                {subsidiaries.map((subsidiary, index) => <li key={index}>{subsidiary.name} - {subsidiary.location}</li>)}
              </ul>
            </div>}
        </div>

        {isConsolidated && <div className="space-y-4 mt-4 border-t pt-4">
            <h3 className="text-md font-medium">Imprese figlie incluse nella relazione</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {subsidiaries.map((subsidiary, index) => <div key={index} className="flex items-center bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                  <span className="text-sm mr-2">{subsidiary.name} ({subsidiary.location})</span>
                  <button onClick={() => removeSubsidiary(index)} className="text-red-500 hover:text-red-700">
                    &times;
                  </button>
                </div>)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Nome dell'impresa figlia" value={newSubsidiary.name} onChange={e => setNewSubsidiary({
            ...newSubsidiary,
            name: e.target.value
          })} />
              <Input placeholder="Sede legale" value={newSubsidiary.location} onChange={e => setNewSubsidiary({
            ...newSubsidiary,
            location: e.target.value
          })} />
            </div>
            
            <Button variant="outline" onClick={handleAddSubsidiary} className="mt-2">
              Aggiungi impresa figlia
            </Button>
          </div>}
      </GlassmorphicCard>

      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <FileText className="mr-2 h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Informativa B 2 - Pratiche per la transizione verso un'economia più sostenibile</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Descrivi brevemente le pratiche specifiche adottate dall'impresa per la transizione verso un'economia più sostenibile. 
            Non includere attività filantropiche, ma piuttosto iniziative concrete per migliorare l'impatto ambientale e sociale dell'impresa.
          </p>
          
          {isLoading ? <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            </div> : <textarea className="w-full min-h-[200px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Descrivi qui le pratiche adottate dalla tua impresa..." value={sustainabilityPractices} onChange={e => setSustainabilityPractices(e.target.value)} />}
          
          <div className="flex justify-start mt-2">
            <Button onClick={handleSavePractices} disabled={isSaving || isLoading} size="sm" className="text-white bg-blue-500 hover:bg-blue-400">
              {isSaving ? <>Salvataggio<span className="ml-2 inline-block animate-spin">⏳</span></> : <>
                  <Save className="mr-2 h-4 w-4" />
                  Salva Dettagli
                </>}
            </Button>
          </div>
        </div>
      </GlassmorphicCard>
      
      <div className="flex justify-end">
        <Button onClick={onContinue} className="bg-blue-500 hover:bg-blue-600">
          Salva informazioni e continua
          <CheckCircle2 className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>;
};
export default BasicInfoSection;
