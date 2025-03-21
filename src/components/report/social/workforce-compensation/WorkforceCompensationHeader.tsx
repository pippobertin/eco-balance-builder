
import React from 'react';
import { CircleDollarSign, Info } from 'lucide-react';

const WorkforceCompensationHeader: React.FC = () => {
  return (
    <>
      <div className="flex items-center mb-4">
        <CircleDollarSign className="mr-2 h-5 w-5 text-green-500" />
        <h3 className="text-xl font-semibold">B10 - Forza lavoro - Retribuzione, contrattazione collettiva e formazione</h3>
      </div>
      
      <div className="p-4 rounded-md mb-4 bg-blue-100">
        <div className="flex items-start">
          <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
          <p className="text-sm text-slate-600">
            Il divario retributivo di genere è la differenza tra i livelli retributivi medi tra dipendenti di sesso femminile e maschile, espressa come percentuale del livello retributivo medio maschile. La copertura della contrattazione collettiva è la percentuale di dipendenti a cui si applicano i contratti collettivi.
          </p>
        </div>
      </div>
    </>
  );
};

export default WorkforceCompensationHeader;
