
import React from 'react';
import { Info } from 'lucide-react';

interface InfoBannerProps {
  selectedOption: string;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ selectedOption }) => {
  // Function to get the description based on the selected option
  const getOptionDescription = () => {
    switch (selectedOption) {
      case 'A':
        return 'OPZIONE A: Modulo Base - Riporta solo gli indicatori ambientali, sociali e di condotta fondamentali.';
      case 'B':
        return 'OPZIONE B: Modulo Base e Modulo Narrativo-PAT - Include informazioni narrative relative a politiche, azioni e obiettivi oltre al Modulo Base.';
      case 'C':
        return 'OPZIONE C: Modulo Base e Modulo Partner commerciali - Include dati aggiuntivi richiesti da finanziatori, investitori e clienti.';
      case 'D':
        return 'OPZIONE D: Modulo Base, Modulo Narrativo-PAT e Modulo Partner commerciali - Combinazione completa di tutti i moduli disponibili.';
      default:
        return 'Seleziona un\'opzione per la tua relazione sulla sostenibilità';
    }
  };

  return (
    <div className="p-4 rounded-md mb-6 bg-gray-500">
      <div className="flex items-start">
        <Info className="mt-0.5 mr-2 h-5 w-5 text-white" />
        <div>
          <p className="text-sm font-medium text-white">{getOptionDescription()}</p>
          <p className="text-sm mt-1 text-white">
            Completa le sezioni seguenti in base all'opzione selezionata. Le metriche ambientali, sociali e di condotta sono obbligatorie per tutte le opzioni.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;
