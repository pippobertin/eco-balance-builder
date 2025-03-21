
import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';

const WorkforceSafetyHeader = () => {
  return (
    <>
      <div className="flex items-center mb-4">
        <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />
        <h3 className="text-xl font-semibold">B9 - Forza lavoro - Salute e sicurezza</h3>
      </div>
      
      <div className="p-4 rounded-md mb-4 bg-blue-100">
        <div className="flex items-start">
          <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
          <p className="text-sm text-slate-600">
            Il tasso di infortuni sul lavoro si calcola con la formula: (Numero di infortuni / Numero totale di ore lavorate in un anno da tutti i dipendenti) x 172.000. Questo indica il numero di infortuni per 100 lavoratori a tempo pieno in un anno.
          </p>
        </div>
      </div>
    </>
  );
};

export default WorkforceSafetyHeader;
