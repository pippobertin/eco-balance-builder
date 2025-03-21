
import React from 'react';
import { Sprout, Info } from 'lucide-react';
import SectionAutoSaveIndicator from '../components/SectionAutoSaveIndicator';

interface BiodiversityHeaderProps {
  reportId: string | undefined;
  isSaving: boolean;
  lastSaved: Date | null;
}

const BiodiversityHeader: React.FC<BiodiversityHeaderProps> = ({ reportId, isSaving, lastSaved }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <Sprout className="mr-2 h-5 w-5 text-green-500" />
        <h3 className="text-xl font-semibold">B5 - Biodiversità</h3>
      </div>
      
      <SectionAutoSaveIndicator className="mb-4" />
      
      <div className="p-4 rounded-md mb-4 bg-green-100">
        <div className="flex items-start">
          <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
          <p className="text-sm text-slate-600">
            Indica l'impatto dell'attività sul territorio e su siti sensibili dal punto di vista della 
            biodiversità. Se non disponibili i dati precisi, puoi inserire stime o indicare la superficie 
            totale dei siti interessati.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BiodiversityHeader;
