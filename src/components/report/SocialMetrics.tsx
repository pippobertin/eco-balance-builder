
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  ShieldAlert, 
  HeartHandshake, 
  GraduationCap,
  Building 
} from 'lucide-react';
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
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      socialMetrics: {
        ...prev.socialMetrics,
        [name]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Metriche Base - Questioni Sociali</h2>
      
      {/* B8 - Forza lavoro - Caratteristiche generali */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Users className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">B8 - Forza lavoro - Caratteristiche generali</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalEmployees">Numero totale di dipendenti</Label>
              <Input
                id="totalEmployees"
                name="totalEmployees"
                type="number"
                placeholder="0"
                value={formValues.socialMetrics?.totalEmployees || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="permanentEmployees">Dipendenti a tempo indeterminato</Label>
              <Input
                id="permanentEmployees"
                name="permanentEmployees"
                type="number"
                placeholder="0"
                value={formValues.socialMetrics?.permanentEmployees || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="temporaryEmployees">Dipendenti a tempo determinato</Label>
              <Input
                id="temporaryEmployees"
                name="temporaryEmployees"
                type="number"
                placeholder="0"
                value={formValues.socialMetrics?.temporaryEmployees || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="maleEmployees">Dipendenti di genere maschile</Label>
              <Input
                id="maleEmployees"
                name="maleEmployees"
                type="number"
                placeholder="0"
                value={formValues.socialMetrics?.maleEmployees || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="femaleEmployees">Dipendenti di genere femminile</Label>
              <Input
                id="femaleEmployees"
                name="femaleEmployees"
                type="number"
                placeholder="0"
                value={formValues.socialMetrics?.femaleEmployees || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="otherGenderEmployees">Dipendenti di altri generi</Label>
              <Input
                id="otherGenderEmployees"
                name="otherGenderEmployees"
                type="number"
                placeholder="0"
                value={formValues.socialMetrics?.otherGenderEmployees || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="employeesByCountry">Dipendenti per paese (se applicabile)</Label>
            <Textarea
              id="employeesByCountry"
              name="employeesByCountry"
              placeholder="Esempio: Italia: 50, Francia: 20, Germania: 10"
              value={formValues.socialMetrics?.employeesByCountry || ""}
              onChange={handleChange}
              className="min-h-[100px]"
            />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workAccidentsNumber">Numero di infortuni sul lavoro registrabili</Label>
              <Input
                id="workAccidentsNumber"
                name="workAccidentsNumber"
                type="number"
                placeholder="0"
                value={formValues.socialMetrics?.workAccidentsNumber || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="workAccidentsRate">Tasso di infortuni sul lavoro (%)</Label>
              <Input
                id="workAccidentsRate"
                name="workAccidentsRate"
                type="number"
                placeholder="0.0"
                value={formValues.socialMetrics?.workAccidentsRate || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workAccidentDeaths">Numero di decessi dovuti a infortuni sul lavoro</Label>
              <Input
                id="workAccidentDeaths"
                name="workAccidentDeaths"
                type="number"
                placeholder="0"
                value={formValues.socialMetrics?.workAccidentDeaths || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="workDiseaseDeaths">Numero di decessi dovuti a malattie professionali</Label>
              <Input
                id="workDiseaseDeaths"
                name="workDiseaseDeaths"
                type="number"
                placeholder="0"
                value={formValues.socialMetrics?.workDiseaseDeaths || ""}
                onChange={handleChange}
              />
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entryWageToMinimumWageRatio">Rapporto tra salario di ingresso e salario minimo</Label>
              <Input
                id="entryWageToMinimumWageRatio"
                name="entryWageToMinimumWageRatio"
                type="number"
                placeholder="0.0"
                value={formValues.socialMetrics?.entryWageToMinimumWageRatio || ""}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Indicare solo se una percentuale significativa di dipendenti è retribuita sulla base di salari soggetti a norme sul salario minimo.
              </p>
            </div>
            
            <div>
              <Label htmlFor="genderPayGap">Divario percentuale di retribuzione tra dipendenti di sesso femminile e maschile (%)</Label>
              <Input
                id="genderPayGap"
                name="genderPayGap"
                type="number"
                placeholder="0.0"
                value={formValues.socialMetrics?.genderPayGap || ""}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Omettere questa informazione se il numero di dipendenti è inferiore a 150.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="collectiveBargainingCoverage">Percentuale di dipendenti coperti da contratti collettivi di lavoro (%)</Label>
              <Input
                id="collectiveBargainingCoverage"
                name="collectiveBargainingCoverage"
                type="number"
                placeholder="0.0"
                value={formValues.socialMetrics?.collectiveBargainingCoverage || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="avgTrainingHoursMale">Numero medio di ore di formazione annuali per dipendente di genere maschile</Label>
              <Input
                id="avgTrainingHoursMale"
                name="avgTrainingHoursMale"
                type="number"
                placeholder="0.0"
                value={formValues.socialMetrics?.avgTrainingHoursMale || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="avgTrainingHoursFemale">Numero medio di ore di formazione annuali per dipendente di genere femminile</Label>
            <Input
              id="avgTrainingHoursFemale"
              name="avgTrainingHoursFemale"
              type="number"
              placeholder="0.0"
              value={formValues.socialMetrics?.avgTrainingHoursFemale || ""}
              onChange={handleChange}
            />
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
            <Textarea
              id="supplyChainImpactProcess"
              name="supplyChainImpactProcess"
              placeholder="Descrivi il processo per identificare se ci sono lavoratori nella catena del valore, comunità interessate o consumatori e utilizzatori finali che sono o possono essere interessati da impatti negativi relativi alle operazioni dell'impresa."
              value={formValues.socialMetrics?.supplyChainImpactProcess || ""}
              onChange={handleChange}
              className="min-h-[150px]"
            />
          </div>
          
          <div>
            <Label htmlFor="identifiedImpacts">Impatti identificati</Label>
            <Textarea
              id="identifiedImpacts"
              name="identifiedImpacts"
              placeholder="Se identificati, descrivi i tipi di impatti, compresi i luoghi in cui si verificano e i gruppi che ne sono interessati."
              value={formValues.socialMetrics?.identifiedImpacts || ""}
              onChange={handleChange}
              className="min-h-[150px]"
            />
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default SocialMetrics;
