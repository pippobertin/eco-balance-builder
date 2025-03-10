import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Users, ShieldAlert, HeartHandshake, GraduationCap, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
interface SocialMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}
const SocialMetrics: React.FC<SocialMetricsProps> = ({
  formValues,
  setFormValues
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      socialMetrics: {
        ...prev.socialMetrics,
        [name]: value
      }
    }));
  };
  return <div className="space-y-6">
      <h2 className="text-2xl font-bold">Metriche Base - Questioni Sociali</h2>
      
      {/* B8 - Forza lavoro - Caratteristiche generali */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Users className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">B8 - Forza lavoro - Caratteristiche generali</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-orange-300">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                L'equivalente a tempo pieno (FTE) è il numero di posizioni a tempo pieno. Si calcola dividendo le ore di lavoro effettive di un dipendente per le ore di una settimana lavorativa a tempo pieno. I dati possono essere espressi sia in numero di persone che in FTE.
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Totale dipendenti</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalEmployees">Numero totale di dipendenti</Label>
              <Input id="totalEmployees" name="totalEmployees" type="number" placeholder="0" value={formValues.socialMetrics?.totalEmployees || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="totalEmployeesFTE">Numero totale di equivalenti a tempo pieno (FTE)</Label>
              <Input id="totalEmployeesFTE" name="totalEmployeesFTE" type="number" placeholder="0.0" value={formValues.socialMetrics?.totalEmployeesFTE || ""} onChange={handleChange} />
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Tipo di contratto</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="permanentEmployees">Dipendenti a tempo indeterminato</Label>
              <Input id="permanentEmployees" name="permanentEmployees" type="number" placeholder="0" value={formValues.socialMetrics?.permanentEmployees || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="temporaryEmployees">Dipendenti a tempo determinato</Label>
              <Input id="temporaryEmployees" name="temporaryEmployees" type="number" placeholder="0" value={formValues.socialMetrics?.temporaryEmployees || ""} onChange={handleChange} />
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Distribuzione per genere</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maleEmployees">Dipendenti di genere maschile</Label>
              <Input id="maleEmployees" name="maleEmployees" type="number" placeholder="0" value={formValues.socialMetrics?.maleEmployees || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="femaleEmployees">Dipendenti di genere femminile</Label>
              <Input id="femaleEmployees" name="femaleEmployees" type="number" placeholder="0" value={formValues.socialMetrics?.femaleEmployees || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="otherGenderEmployees">Dipendenti di altri generi</Label>
              <Input id="otherGenderEmployees" name="otherGenderEmployees" type="number" placeholder="0" value={formValues.socialMetrics?.otherGenderEmployees || ""} onChange={handleChange} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="employeesByCountry">Dipendenti per paese (se applicabile)</Label>
            <Textarea id="employeesByCountry" name="employeesByCountry" placeholder="Esempio: Italia: 50, Francia: 20, Germania: 10" value={formValues.socialMetrics?.employeesByCountry || ""} onChange={handleChange} className="min-h-[100px]" />
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* B9 - Forza lavoro - Salute e sicurezza */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />
          <h3 className="text-xl font-semibold">B9 - Forza lavoro - Salute e sicurezza</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Il tasso di infortuni sul lavoro si calcola con la formula: (Numero di infortuni / Numero totale di ore lavorate in un anno da tutti i dipendenti) x 200.000. Questo indica il numero di infortuni per 100 lavoratori a tempo pieno in un anno.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workAccidentsNumber">Numero di infortuni sul lavoro registrabili</Label>
              <Input id="workAccidentsNumber" name="workAccidentsNumber" type="number" placeholder="0" value={formValues.socialMetrics?.workAccidentsNumber || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="totalHoursWorked">Ore totali lavorate nell'anno</Label>
              <Input id="totalHoursWorked" name="totalHoursWorked" type="number" placeholder="0" value={formValues.socialMetrics?.totalHoursWorked || ""} onChange={handleChange} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workAccidentsRate">Tasso di infortuni sul lavoro (%)</Label>
              <Input id="workAccidentsRate" name="workAccidentsRate" type="number" placeholder="0.0" value={formValues.socialMetrics?.workAccidentsRate || ""} onChange={handleChange} />
              <p className="text-sm text-gray-500 mt-1">
                Calcolato come (N. infortuni / Ore totali lavorate) x 200.000
              </p>
            </div>
            
            <div>
              <Label htmlFor="workAccidentDeaths">Numero di decessi dovuti a infortuni sul lavoro</Label>
              <Input id="workAccidentDeaths" name="workAccidentDeaths" type="number" placeholder="0" value={formValues.socialMetrics?.workAccidentDeaths || ""} onChange={handleChange} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="workDiseaseDeaths">Numero di decessi dovuti a malattie professionali</Label>
            <Input id="workDiseaseDeaths" name="workDiseaseDeaths" type="number" placeholder="0" value={formValues.socialMetrics?.workDiseaseDeaths || ""} onChange={handleChange} />
            <p className="text-sm text-gray-500 mt-1">
              Include malattie direttamente collegate allo svolgimento del lavoro, attestate da un professionista sanitario
            </p>
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* B10 - Forza lavoro - Retribuzione, contrattazione collettiva e formazione */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <GraduationCap className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">B10 - Forza lavoro - Retribuzione, contrattazione collettiva e formazione</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Il divario retributivo di genere è la differenza tra i livelli retributivi medi tra dipendenti di sesso femminile e maschile, espressa come percentuale del livello retributivo medio maschile. La copertura della contrattazione collettiva è la percentuale di dipendenti a cui si applicano i contratti collettivi.
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Retribuzione</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entryWage">Salario di ingresso (€)</Label>
              <Input id="entryWage" name="entryWage" type="number" placeholder="0.0" value={formValues.socialMetrics?.entryWage || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="localMinimumWage">Salario minimo locale (€)</Label>
              <Input id="localMinimumWage" name="localMinimumWage" type="number" placeholder="0.0" value={formValues.socialMetrics?.localMinimumWage || ""} onChange={handleChange} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entryWageToMinimumWageRatio">Rapporto tra salario di ingresso e salario minimo</Label>
              <Input id="entryWageToMinimumWageRatio" name="entryWageToMinimumWageRatio" type="number" placeholder="0.0" value={formValues.socialMetrics?.entryWageToMinimumWageRatio || ""} onChange={handleChange} />
              <p className="text-sm text-gray-500 mt-1">
                Indicare solo se una percentuale significativa di dipendenti è retribuita sulla base di salari soggetti a norme sul salario minimo
              </p>
            </div>
            
            <div>
              <Label htmlFor="genderPayGap">Divario retributivo di genere (%)</Label>
              <Input id="genderPayGap" name="genderPayGap" type="number" placeholder="0.0" value={formValues.socialMetrics?.genderPayGap || ""} onChange={handleChange} />
              <p className="text-sm text-gray-500 mt-1">
                Omettere questa informazione se il numero di dipendenti è inferiore a 150
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Contrattazione collettiva</h4>
          <div>
            <Label htmlFor="collectiveBargainingCoverage">Percentuale di dipendenti coperti da contratti collettivi di lavoro (%)</Label>
            <Input id="collectiveBargainingCoverage" name="collectiveBargainingCoverage" type="number" placeholder="0.0" value={formValues.socialMetrics?.collectiveBargainingCoverage || ""} onChange={handleChange} />
          </div>
          
          <h4 className="font-medium text-lg">Formazione</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="avgTrainingHoursMale">Ore medie di formazione annuali per dipendente di genere maschile</Label>
              <Input id="avgTrainingHoursMale" name="avgTrainingHoursMale" type="number" placeholder="0.0" value={formValues.socialMetrics?.avgTrainingHoursMale || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="avgTrainingHoursFemale">Ore medie di formazione annuali per dipendente di genere femminile</Label>
              <Input id="avgTrainingHoursFemale" name="avgTrainingHoursFemale" type="number" placeholder="0.0" value={formValues.socialMetrics?.avgTrainingHoursFemale || ""} onChange={handleChange} />
            </div>
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* B11 - Lavoratori nella catena del valore, comunità interessate, consumatori e utilizzatori finali */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <HeartHandshake className="mr-2 h-5 w-5 text-orange-500" />
          <h3 className="text-xl font-semibold">B11 - Lavoratori nella catena del valore, comunità e consumatori</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="supplyChainImpactProcess">Processo di identificazione degli impatti sulla catena del valore</Label>
            <Textarea id="supplyChainImpactProcess" name="supplyChainImpactProcess" placeholder="Descrivi il processo per identificare se ci sono lavoratori nella catena del valore, comunità interessate o consumatori e utilizzatori finali che sono o possono essere interessati da impatti negativi relativi alle operazioni dell'impresa." value={formValues.socialMetrics?.supplyChainImpactProcess || ""} onChange={handleChange} className="min-h-[150px]" />
          </div>
          
          <div>
            <Label htmlFor="identifiedImpacts">Impatti identificati</Label>
            <Textarea id="identifiedImpacts" name="identifiedImpacts" placeholder="Se identificati, descrivi i tipi di impatti, compresi i luoghi in cui si verificano e i gruppi che ne sono interessati." value={formValues.socialMetrics?.identifiedImpacts || ""} onChange={handleChange} className="min-h-[150px]" />
          </div>
        </div>
      </GlassmorphicCard>
    </div>;
};
export default SocialMetrics;