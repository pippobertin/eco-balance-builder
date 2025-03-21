
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InfoHoverCard from './InfoHoverCard';

interface WageFieldsProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const WageFields: React.FC<WageFieldsProps> = ({ formValues, handleChange }) => {
  return (
    <>
      <h4 className="font-medium text-lg">Retribuzione</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="entryWage" className="flex items-center">
            Salario di ingresso (€)
            <InfoHoverCard>
              <p className="text-sm text-slate-600">
                Per "salario di ingresso" si intende il salario a tempo pieno della categoria occupazionale più
                bassa. I salari dei tirocinanti e degli apprendisti non devono essere considerati nell'identificazione
                del salario di ingresso dell'impresa.
              </p>
            </InfoHoverCard>
          </Label>
          <Input 
            id="entryWage" 
            name="entryWage" 
            type="number" 
            placeholder="0.0" 
            value={formValues.socialMetrics?.entryWage || ""} 
            onChange={handleChange} 
          />
        </div>
        
        <div>
          <Label htmlFor="localMinimumWage" className="flex items-center">
            Salario minimo locale (€)
            <InfoHoverCard>
              <p className="text-sm text-slate-600">
                Per "salario minimo" si intende il compenso minimo di lavoro per ora, o altra unità di tempo,
                consentito dalla legge. A seconda del Paese, il salario minimo può essere stabilito direttamente
                dalla legge o attraverso accordi di contrattazione collettiva. L'impresa deve fare riferimento al
                salario minimo applicabile per il Paese in cui si riferisce (sia esso stabilito direttamente dalla legge
                o attraverso un contratto collettivo di lavoro).
              </p>
            </InfoHoverCard>
          </Label>
          <Input 
            id="localMinimumWage" 
            name="localMinimumWage" 
            type="number" 
            placeholder="0.0" 
            value={formValues.socialMetrics?.localMinimumWage || ""} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="entryWageToMinimumWageRatio" className="flex items-center">
            Rapporto tra salario di ingresso e salario minimo
            <InfoHoverCard>
              <p className="text-sm text-slate-600">
                Per calcolare il rapporto tra il salario di ingresso e il salario minimo, si utilizza la formula seguente:
                <br />
                <span className="font-medium mt-1 block">Indice = Salario di ingresso / Salario minimo</span>
                <br />
                Per "percentuale significativa di dipendenti" si intende la maggioranza dei dipendenti dell'impresa,
                senza considerare stagisti e apprendisti.
              </p>
            </InfoHoverCard>
          </Label>
          <Input 
            id="entryWageToMinimumWageRatio" 
            name="entryWageToMinimumWageRatio" 
            type="number" 
            placeholder="0.0" 
            value={formValues.socialMetrics?.entryWageToMinimumWageRatio || ""} 
            onChange={handleChange}
            readOnly
            className="bg-gray-50"
          />
          <p className="text-sm text-gray-500 mt-1">
            Indicare solo se una percentuale significativa di dipendenti è retribuita sulla base di salari soggetti a norme sul salario minimo
          </p>
        </div>
        
        <div>
          <Label htmlFor="genderPayGap">Divario retributivo di genere (%)</Label>
          <Input 
            id="genderPayGap" 
            name="genderPayGap" 
            type="number" 
            placeholder="0.0" 
            value={formValues.socialMetrics?.genderPayGap || ""} 
            onChange={handleChange} 
          />
          <p className="text-sm text-gray-500 mt-1">
            Formula: (retribuzione uomini-retribuzione donne)/retribuzione uomini*100
          </p>
        </div>
      </div>
    </>
  );
};

export default WageFields;
