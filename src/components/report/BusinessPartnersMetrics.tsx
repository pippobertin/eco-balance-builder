import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, Factory, Users, FileText, Thermometer, Leaf, AlertTriangle, Handshake, GraduationCap, Scale, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
interface BusinessPartnersMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}
const BusinessPartnersMetrics: React.FC<BusinessPartnersMetricsProps> = ({
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
      businessPartnersMetrics: {
        ...prev.businessPartnersMetrics,
        [name]: value
      }
    }));
  };
  const handleSelectChange = (name: string, value: string) => {
    setFormValues((prev: any) => ({
      ...prev,
      businessPartnersMetrics: {
        ...prev.businessPartnersMetrics,
        [name]: value
      }
    }));
  };
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormValues((prev: any) => ({
      ...prev,
      businessPartnersMetrics: {
        ...prev.businessPartnersMetrics,
        [name]: checked
      }
    }));
  };
  return <div className="space-y-6">
      <h2 className="text-2xl font-bold">Modulo Partner Commerciali</h2>
      
      <div className="p-4 rounded-md mb-4 bg-slate-100">
        <div className="flex items-start">
          <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
          <p className="text-sm text-slate-600">
            Questo modulo individua elementi d'informativa in relazione alle informazioni generalmente richieste dai partner commerciali, dagli investitori e dai finanziatori dell'impresa. Le informative da BP1 a BP11 devono essere considerate e comunicate se applicabili o rilevanti per l'attività dell'impresa.
          </p>
        </div>
      </div>

      {/* BP1 - Ricavi in alcuni settori */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Factory className="mr-2 h-5 w-5 text-gray-600" />
          <h3 className="text-xl font-semibold">BP1 - Ricavi in alcuni settori</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Indica se l'impresa è attiva in uno o più dei seguenti settori e, in caso affermativo, i relativi ricavi.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="controversialWeapons" checked={formValues.businessPartnersMetrics?.controversialWeapons} onCheckedChange={checked => handleCheckboxChange('controversialWeapons', !!checked)} />
              <Label htmlFor="controversialWeapons">
                Armi controverse (mine antiuomo, munizioni a grappolo, armi chimiche e biologiche)
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="tobacco" checked={formValues.businessPartnersMetrics?.tobacco} onCheckedChange={checked => handleCheckboxChange('tobacco', !!checked)} />
              <Label htmlFor="tobacco">Coltivazione e produzione di tabacco</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="fossilFuels" checked={formValues.businessPartnersMetrics?.fossilFuels} onCheckedChange={checked => handleCheckboxChange('fossilFuels', !!checked)} />
              <Label htmlFor="fossilFuels">
                Settore dei combustibili fossili (carbone, petrolio e gas)
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="chemicals" checked={formValues.businessPartnersMetrics?.chemicals} onCheckedChange={checked => handleCheckboxChange('chemicals', !!checked)} />
              <Label htmlFor="chemicals">
                Produzione di sostanze chimiche (divisione 20.2 dell'allegato I del Regolamento CE n. 1893/2006)
              </Label>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="controversialWeaponsRevenue">Ricavi da armi controverse (€)</Label>
              <Input id="controversialWeaponsRevenue" name="controversialWeaponsRevenue" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.controversialWeaponsRevenue || ""} onChange={handleChange} disabled={!formValues.businessPartnersMetrics?.controversialWeapons} />
            </div>
            
            <div>
              <Label htmlFor="tobaccoRevenue">Ricavi da tabacco (€)</Label>
              <Input id="tobaccoRevenue" name="tobaccoRevenue" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.tobaccoRevenue || ""} onChange={handleChange} disabled={!formValues.businessPartnersMetrics?.tobacco} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="coalRevenue">Ricavi da carbone (€)</Label>
              <Input id="coalRevenue" name="coalRevenue" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.coalRevenue || ""} onChange={handleChange} disabled={!formValues.businessPartnersMetrics?.fossilFuels} />
            </div>
            
            <div>
              <Label htmlFor="oilRevenue">Ricavi da petrolio (€)</Label>
              <Input id="oilRevenue" name="oilRevenue" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.oilRevenue || ""} onChange={handleChange} disabled={!formValues.businessPartnersMetrics?.fossilFuels} />
            </div>
            
            <div>
              <Label htmlFor="gasRevenue">Ricavi da gas (€)</Label>
              <Input id="gasRevenue" name="gasRevenue" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.gasRevenue || ""} onChange={handleChange} disabled={!formValues.businessPartnersMetrics?.fossilFuels} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="chemicalsRevenue">Ricavi da produzione di sostanze chimiche (€)</Label>
            <Input id="chemicalsRevenue" name="chemicalsRevenue" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.chemicalsRevenue || ""} onChange={handleChange} disabled={!formValues.businessPartnersMetrics?.chemicals} />
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* BP2 - Indice di diversità di genere negli organi di governance */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Users className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">BP2 - Indice di diversità di genere negli organi di governance</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maleGovernanceMembers">Membri di genere maschile</Label>
              <Input id="maleGovernanceMembers" name="maleGovernanceMembers" type="number" placeholder="0" value={formValues.businessPartnersMetrics?.maleGovernanceMembers || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="femaleGovernanceMembers">Membri di genere femminile</Label>
              <Input id="femaleGovernanceMembers" name="femaleGovernanceMembers" type="number" placeholder="0" value={formValues.businessPartnersMetrics?.femaleGovernanceMembers || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="otherGenderGovernanceMembers">Membri di altri generi</Label>
              <Input id="otherGenderGovernanceMembers" name="otherGenderGovernanceMembers" type="number" placeholder="0" value={formValues.businessPartnersMetrics?.otherGenderGovernanceMembers || ""} onChange={handleChange} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="genderDiversityIndex">Indice di diversità di genere (%)</Label>
            <Input id="genderDiversityIndex" name="genderDiversityIndex" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.genderDiversityIndex || ""} onChange={handleChange} />
            <p className="text-sm text-gray-500 mt-1">
              Percentuale di membri non appartenenti al genere prevalente nell'organo di governance
            </p>
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* BP3 - Obiettivo di riduzione delle emissioni di gas a effetto serra */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Leaf className="mr-2 h-5 w-5 text-green-600" />
          <h3 className="text-xl font-semibold">BP3 - Obiettivo di riduzione delle emissioni di gas a effetto serra</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="hasGhgReductionTargets" checked={formValues.businessPartnersMetrics?.hasGhgReductionTargets} onCheckedChange={checked => handleCheckboxChange('hasGhgReductionTargets', !!checked)} />
            <Label htmlFor="hasGhgReductionTargets">
              L'impresa ha fissato obiettivi di riduzione delle emissioni di gas a effetto serra
            </Label>
          </div>
          
          {formValues.businessPartnersMetrics?.hasGhgReductionTargets && <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ghgReductionTargetScope1">Obiettivo di riduzione per Ambito 1 (%)</Label>
                  <Input id="ghgReductionTargetScope1" name="ghgReductionTargetScope1" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.ghgReductionTargetScope1 || ""} onChange={handleChange} />
                </div>
                
                <div>
                  <Label htmlFor="ghgReductionTargetScope2">Obiettivo di riduzione per Ambito 2 (%)</Label>
                  <Input id="ghgReductionTargetScope2" name="ghgReductionTargetScope2" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.ghgReductionTargetScope2 || ""} onChange={handleChange} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ghgReductionTargetScope3">Obiettivo di riduzione per Ambito 3 (%, opzionale)</Label>
                  <Input id="ghgReductionTargetScope3" name="ghgReductionTargetScope3" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.ghgReductionTargetScope3 || ""} onChange={handleChange} />
                </div>
                
                <div>
                  <Label htmlFor="ghgReductionTargetYear">Anno target</Label>
                  <Input id="ghgReductionTargetYear" name="ghgReductionTargetYear" type="number" placeholder="2030" value={formValues.businessPartnersMetrics?.ghgReductionTargetYear || ""} onChange={handleChange} />
                </div>
              </div>
              
              <div>
                <Label htmlFor="ghgReductionBaselineYear">Anno di riferimento per il calcolo della riduzione</Label>
                <Input id="ghgReductionBaselineYear" name="ghgReductionBaselineYear" type="number" placeholder="2019" value={formValues.businessPartnersMetrics?.ghgReductionBaselineYear || ""} onChange={handleChange} />
              </div>
            </>}
        </div>
      </GlassmorphicCard>
      
      {/* BP4 - Piano di transizione per la mitigazione dei cambiamenti climatici */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Thermometer className="mr-2 h-5 w-5 text-red-500" />
          <h3 className="text-xl font-semibold">BP4 - Piano di transizione per la mitigazione dei cambiamenti climatici</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="hasTransitionPlan" checked={formValues.businessPartnersMetrics?.hasTransitionPlan} onCheckedChange={checked => handleCheckboxChange('hasTransitionPlan', !!checked)} />
            <Label htmlFor="hasTransitionPlan">
              L'impresa ha adottato un piano di transizione per la mitigazione dei cambiamenti climatici
            </Label>
          </div>
          
          {formValues.businessPartnersMetrics?.hasTransitionPlan && <div>
              <Label htmlFor="transitionPlanDetails">Dettagli del piano di transizione</Label>
              <Textarea id="transitionPlanDetails" name="transitionPlanDetails" placeholder="Spiega come gli obiettivi di riduzione delle emissioni di gas a effetto serra siano compatibili con la limitazione del riscaldamento globale a 1,5°C, in linea con l'Accordo di Parigi." value={formValues.businessPartnersMetrics?.transitionPlanDetails || ""} onChange={handleChange} className="min-h-[150px]" />
            </div>}
        </div>
      </GlassmorphicCard>
      
      {/* BP5 - Rischi fisici da cambiamento climatico */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
          <h3 className="text-xl font-semibold">BP5 - Rischi fisici da cambiamento climatico</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="hasPhysicalClimateRisks" checked={formValues.businessPartnersMetrics?.hasPhysicalClimateRisks} onCheckedChange={checked => handleCheckboxChange('hasPhysicalClimateRisks', !!checked)} />
            <Label htmlFor="hasPhysicalClimateRisks">
              L'impresa è esposta a rischi fisici rilevanti da cambiamento climatico
            </Label>
          </div>
          
          {formValues.businessPartnersMetrics?.hasPhysicalClimateRisks && <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assetsAtRiskAmount">Importo monetario degli attivi soggetti a rischi fisici (€)</Label>
                  <Input id="assetsAtRiskAmount" name="assetsAtRiskAmount" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.assetsAtRiskAmount || ""} onChange={handleChange} />
                </div>
                
                <div>
                  <Label htmlFor="assetsAtRiskPercentage">Quota degli attivi totali soggetti a rischi fisici (%)</Label>
                  <Input id="assetsAtRiskPercentage" name="assetsAtRiskPercentage" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.assetsAtRiskPercentage || ""} onChange={handleChange} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adaptationCoverage">Quota di attivi a rischio interessati dalle azioni di adattamento (%)</Label>
                  <Input id="adaptationCoverage" name="adaptationCoverage" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.adaptationCoverage || ""} onChange={handleChange} />
                </div>
                
                <div>
                  <Label htmlFor="revenueAtRiskPercentage">Quota di ricavi netti soggetti a rischio fisico (%)</Label>
                  <Input id="revenueAtRiskPercentage" name="revenueAtRiskPercentage" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.revenueAtRiskPercentage || ""} onChange={handleChange} />
                </div>
              </div>
              
              <div>
                <Label htmlFor="riskAssetsLocation">Posizione degli attivi significativi interessati</Label>
                <Textarea id="riskAssetsLocation" name="riskAssetsLocation" placeholder="Indica la posizione geografica degli attivi significativi interessati da rischi fisici rilevanti." value={formValues.businessPartnersMetrics?.riskAssetsLocation || ""} onChange={handleChange} className="min-h-[100px]" />
              </div>
              
              <div>
                <Label htmlFor="realEstateEnergyEfficiency">Ripartizione del valore contabile delle attività immobiliari per classi di efficienza energetica</Label>
                <Textarea id="realEstateEnergyEfficiency" name="realEstateEnergyEfficiency" placeholder="Esempio: Classe A: 30%, Classe B: 25%, Classe C: 20%, ecc." value={formValues.businessPartnersMetrics?.realEstateEnergyEfficiency || ""} onChange={handleChange} className="min-h-[100px]" />
              </div>
            </>}
        </div>
      </GlassmorphicCard>
      
      {/* BP6 - Indice rifiuti pericolosi e/o radioattivi */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
          <h3 className="text-xl font-semibold">BP6 - Indice rifiuti pericolosi e/o radioattivi</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="hasHazardousWaste" checked={formValues.businessPartnersMetrics?.hasHazardousWaste} onCheckedChange={checked => handleCheckboxChange('hasHazardousWaste', !!checked)} />
            <Label htmlFor="hasHazardousWaste">
              L'impresa genera rifiuti pericolosi e/o radioattivi
            </Label>
          </div>
          
          {formValues.businessPartnersMetrics?.hasHazardousWaste && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hazardousWasteTotal">Quantità totale di rifiuti pericolosi (tonnellate)</Label>
                <Input id="hazardousWasteTotal" name="hazardousWasteTotal" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.hazardousWasteTotal || ""} onChange={handleChange} />
              </div>
              
              <div>
                <Label htmlFor="radioactiveWasteTotal">Quantità totale di rifiuti radioattivi (tonnellate)</Label>
                <Input id="radioactiveWasteTotal" name="radioactiveWasteTotal" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.radioactiveWasteTotal || ""} onChange={handleChange} />
              </div>
            </div>}
        </div>
      </GlassmorphicCard>
      
      {/* BP7 - Allineamento con gli strumenti riconosciuti a livello internazionale */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Handshake className="mr-2 h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-semibold">BP7 - Allineamento con gli strumenti riconosciuti a livello internazionale</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="hasPoliciesAligned" checked={formValues.businessPartnersMetrics?.hasPoliciesAligned} onCheckedChange={checked => handleCheckboxChange('hasPoliciesAligned', !!checked)} />
            <Label htmlFor="hasPoliciesAligned">
              Le politiche relative alla forza lavoro sono allineate con gli strumenti pertinenti riconosciuti a livello internazionale
            </Label>
          </div>
          
          {formValues.businessPartnersMetrics?.hasPoliciesAligned && <div>
              <Label htmlFor="alignedInstruments">Strumenti pertinenti riconosciuti</Label>
              <Textarea id="alignedInstruments" name="alignedInstruments" placeholder="Specifica con quali strumenti pertinenti riconosciuti a livello internazionale sono allineate le politiche, compresi i Principi guida delle Nazioni Unite su imprese e diritti umani." value={formValues.businessPartnersMetrics?.alignedInstruments || ""} onChange={handleChange} className="min-h-[120px]" />
            </div>}
        </div>
      </GlassmorphicCard>
      
      {/* BP8 - Processi per monitorare la conformità e meccanismi per affrontare le violazioni */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Scale className="mr-2 h-5 w-5 text-indigo-600" />
          <h3 className="text-xl font-semibold">BP8 - Processi per monitorare la conformità e meccanismi per affrontare le violazioni</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="hasComplianceProcesses" checked={formValues.businessPartnersMetrics?.hasComplianceProcesses} onCheckedChange={checked => handleCheckboxChange('hasComplianceProcesses', !!checked)} />
            <Label htmlFor="hasComplianceProcesses">
              L'impresa dispone di processi per monitorare il rispetto degli standard internazionali
            </Label>
          </div>
          
          {formValues.businessPartnersMetrics?.hasComplianceProcesses && <div>
              <Label htmlFor="complianceProcessesDetails">Dettagli sui processi di monitoraggio</Label>
              <Textarea id="complianceProcessesDetails" name="complianceProcessesDetails" placeholder="Descrivi i processi per monitorare il rispetto delle Linee guida dell'OCSE per le imprese multinazionali e dei Principi guida delle Nazioni Unite su imprese e diritti umani, compresi i meccanismi di gestione delle lamentele e dei reclami." value={formValues.businessPartnersMetrics?.complianceProcessesDetails || ""} onChange={handleChange} className="min-h-[150px]" />
            </div>}
        </div>
      </GlassmorphicCard>
      
      {/* BP9 - Violazione delle Linee guida dell'OCSE o dei Principi guida delle Nazioni Unite */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
          <h3 className="text-xl font-semibold">BP9 - Violazione delle Linee guida dell'OCSE o dei Principi guida delle Nazioni Unite</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="hasViolations" checked={formValues.businessPartnersMetrics?.hasViolations} onCheckedChange={checked => handleCheckboxChange('hasViolations', !!checked)} />
            <Label htmlFor="hasViolations">
              Si sono verificate violazioni nell'anno di riferimento
            </Label>
          </div>
          
          {formValues.businessPartnersMetrics?.hasViolations && <div>
              <Label htmlFor="violationsDetails">Dettagli sulle violazioni</Label>
              <Textarea id="violationsDetails" name="violationsDetails" placeholder="Descrivi le violazioni dei Principi guida delle Nazioni Unite su imprese e diritti umani, della Dichiarazione dell'ILO sui principi e i diritti fondamentali nel lavoro o delle Linee guida dell'OCSE per le imprese multinazionali in relazione alla propria forza lavoro." value={formValues.businessPartnersMetrics?.violationsDetails || ""} onChange={handleChange} className="min-h-[150px]" />
            </div>}
        </div>
      </GlassmorphicCard>
      
      {/* BP10 - Equilibrio tra vita professionale e vita privata */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Users className="mr-2 h-5 w-5 text-purple-600" />
          <h3 className="text-xl font-semibold">BP10 - Equilibrio tra vita professionale e vita privata</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-gray-100">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                Il congedo per motivi familiari comprende il congedo di maternità, di paternità, parentale e per i prestatori di assistenza.
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Dipendenti con diritto al congedo per motivi familiari</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maleFamilyLeaveEligible">Dipendenti di genere maschile con diritto (%)</Label>
              <Input id="maleFamilyLeaveEligible" name="maleFamilyLeaveEligible" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.maleFamilyLeaveEligible || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="femaleFamilyLeaveEligible">Dipendenti di genere femminile con diritto (%)</Label>
              <Input id="femaleFamilyLeaveEligible" name="femaleFamilyLeaveEligible" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.femaleFamilyLeaveEligible || ""} onChange={handleChange} />
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Dipendenti che hanno usufruito del congedo per motivi familiari</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maleFamilyLeaveUsed">Dipendenti di genere maschile che ne hanno usufruito (%)</Label>
              <Input id="maleFamilyLeaveUsed" name="maleFamilyLeaveUsed" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.maleFamilyLeaveUsed || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="femaleFamilyLeaveUsed">Dipendenti di genere femminile che ne hanno usufruito (%)</Label>
              <Input id="femaleFamilyLeaveUsed" name="femaleFamilyLeaveUsed" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.femaleFamilyLeaveUsed || ""} onChange={handleChange} />
            </div>
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* BP11 - Numero di apprendisti */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <GraduationCap className="mr-2 h-5 w-5 text-green-600" />
          <h3 className="text-xl font-semibold">BP11 - Numero di apprendisti</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="hasApprentices" checked={formValues.businessPartnersMetrics?.hasApprentices} onCheckedChange={checked => handleCheckboxChange('hasApprentices', !!checked)} />
            <Label htmlFor="hasApprentices">
              L'impresa ha avuto apprendisti nel periodo di riferimento
            </Label>
          </div>
          
          {formValues.businessPartnersMetrics?.hasApprentices && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="apprenticesNumber">Numero di apprendisti</Label>
                <Input id="apprenticesNumber" name="apprenticesNumber" type="number" placeholder="0" value={formValues.businessPartnersMetrics?.apprenticesNumber || ""} onChange={handleChange} />
              </div>
              
              <div>
                <Label htmlFor="apprenticesPercentage">Percentuale sul totale dei dipendenti (%)</Label>
                <Input id="apprenticesPercentage" name="apprenticesPercentage" type="number" placeholder="0.0" value={formValues.businessPartnersMetrics?.apprenticesPercentage || ""} onChange={handleChange} />
              </div>
            </div>}
        </div>
      </GlassmorphicCard>
    </div>;
};
export default BusinessPartnersMetrics;