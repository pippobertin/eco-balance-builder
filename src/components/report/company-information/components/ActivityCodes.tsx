
import React, { useMemo } from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { naceOptions, atecoOptions, atecoByNaceMap } from '../data/formOptions';

interface ActivityCodesProps {
  atecoCode: string;
  naceCode: string;
  handleSelectChange: (name: string, value: string) => void;
}

const ActivityCodes: React.FC<ActivityCodesProps> = ({
  atecoCode,
  naceCode,
  handleSelectChange
}) => {
  // Filtra le opzioni ATECO in base al NACE selezionato
  const filteredAtecoOptions = useMemo(() => {
    if (naceCode && atecoByNaceMap[naceCode]) {
      return atecoByNaceMap[naceCode];
    }
    return atecoOptions; // Opzioni di default se nessun NACE è selezionato
  }, [naceCode]);

  // Reset dell'ATECO quando cambia il NACE
  const handleNaceChange = (value: string) => {
    handleSelectChange('nace_code', value);
    
    // Resetta il codice ATECO se non è valido per il nuovo NACE selezionato
    if (atecoCode) {
      const isAtecoValid = atecoByNaceMap[value]?.some(option => option.value === atecoCode);
      if (!isAtecoValid) {
        handleSelectChange('ateco_code', '');
      }
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="nace_code">Codice NACE</Label>
        <Select 
          value={naceCode || ''} 
          onValueChange={handleNaceChange}
        >
          <SelectTrigger id="nace_code">
            <SelectValue placeholder="Seleziona codice NACE" />
          </SelectTrigger>
          <SelectContent>
            {naceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ateco_code">Codice ATECO</Label>
        <Select 
          value={atecoCode || ''} 
          onValueChange={(value) => handleSelectChange('ateco_code', value)}
          disabled={!naceCode}
        >
          <SelectTrigger id="ateco_code">
            <SelectValue placeholder={naceCode ? "Seleziona codice ATECO" : "Seleziona prima il codice NACE"} />
          </SelectTrigger>
          <SelectContent>
            {filteredAtecoOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!naceCode && (
          <p className="text-sm text-amber-600 mt-1">Seleziona prima un codice NACE</p>
        )}
      </div>
    </>
  );
};

export default ActivityCodes;
