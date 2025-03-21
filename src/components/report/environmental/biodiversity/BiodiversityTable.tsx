
import React from 'react';
import { BiodiversityLandUseData } from '../hooks/biodiversity/useBiodiversityLandUse';
import BiodiversityTableHeader from './components/BiodiversityTableHeader';
import BiodiversityTableRow from './components/BiodiversityTableRow';

interface BiodiversityTableProps {
  data: BiodiversityLandUseData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  percentageChanges: {
    totalLandUseChange: number | null;
    impermeableSurfaceChange: number | null;
    natureSurfaceOnsiteChange: number | null;
    natureSurfaceOffsiteChange: number | null;
  };
}

const BiodiversityTable: React.FC<BiodiversityTableProps> = ({
  data,
  handleChange,
  percentageChanges
}) => {
  const tooltipContents = {
    totalLandUse: "La superficie totale di terreno utilizzata dall'azienda per le sue attività, espressa in ettari (ha).",
    impermeableSurface: "Si riferisce all'area di terreno coperta da materiali impermeabili, che impediscono all'acqua piovana di infiltrarsi nel suolo naturale. Include edifici, superfici esterne, strade e parcheggi asfaltati o cementati, piazzali industriali pavimentati, marciapiedi e sentieri pavimentati.",
    natureSurfaceOnsite: "Si riferisce a porzioni di terreno all'interno del sito operativo dell'azienda gestite o create per favorire la biodiversità e gli ecosistemi naturali. Esempi includono giardini naturalistici con piante autoctone, stagni o zone umide artificiali, boschetti o aree boscate, tetti verdi, fasce tampone vegetate.",
    natureSurfaceOffsite: "Si riferisce ad azioni o progetti di conservazione e ripristino della biodiversità realizzati dall'azienda al di fuori del suo sito operativo. Esempi includono progetti di riforestazione o ripristino di habitat, creazione o gestione di riserve naturali, progetti di conservazione di specie minacciate, corridoi ecologici."
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <BiodiversityTableHeader />
        <tbody>
          <BiodiversityTableRow 
            label="Uso totale del suolo"
            tooltipTitle="Uso totale del suolo"
            tooltipContent={tooltipContents.totalLandUse}
            previousValue={data.previousTotalLandUse}
            currentValue={data.currentTotalLandUse}
            percentageChange={percentageChanges.totalLandUseChange}
            previousFieldName="previousTotalLandUse"
            currentFieldName="currentTotalLandUse"
            handleChange={handleChange}
          />
          <BiodiversityTableRow 
            label="Superficie impermeabilizzata"
            tooltipTitle="Superficie impermeabilizzata"
            tooltipContent={tooltipContents.impermeableSurface}
            previousValue={data.previousImpermeableSurface}
            currentValue={data.currentImpermeableSurface}
            percentageChange={percentageChanges.impermeableSurfaceChange}
            previousFieldName="previousImpermeableSurface"
            currentFieldName="currentImpermeableSurface"
            handleChange={handleChange}
          />
          <BiodiversityTableRow 
            label="Superficie orientata alla natura in sito"
            tooltipTitle="Superficie orientata alla natura in sito"
            tooltipContent={tooltipContents.natureSurfaceOnsite}
            previousValue={data.previousNatureSurfaceOnsite}
            currentValue={data.currentNatureSurfaceOnsite}
            percentageChange={percentageChanges.natureSurfaceOnsiteChange}
            previousFieldName="previousNatureSurfaceOnsite"
            currentFieldName="currentNatureSurfaceOnsite"
            handleChange={handleChange}
          />
          <BiodiversityTableRow 
            label="Superficie orientata alla natura fuori sito"
            tooltipTitle="Superficie orientata alla natura fuori sito"
            tooltipContent={tooltipContents.natureSurfaceOffsite}
            previousValue={data.previousNatureSurfaceOffsite}
            currentValue={data.currentNatureSurfaceOffsite}
            percentageChange={percentageChanges.natureSurfaceOffsiteChange}
            previousFieldName="previousNatureSurfaceOffsite"
            currentFieldName="currentNatureSurfaceOffsite"
            handleChange={handleChange}
          />
        </tbody>
      </table>
    </div>
  );
};

export default BiodiversityTable;
