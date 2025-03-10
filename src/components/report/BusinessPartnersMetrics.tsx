
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Briefcase, Info, AlertTriangle, Globe, Coins, Target, Shield, Zap, Leaf, Users, BarChart4, Clock } from 'lucide-react';

interface BusinessPartnersMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const BusinessPartnersMetrics: React.FC<BusinessPartnersMetricsProps> = ({ 
  formValues,
  setFormValues 
}) => {
  const [businessPartners, setBusinessPartners] = useState<any>(
    formValues.businessPartners || {
      // BP 1 - Ricavi in alcuni settori
      sensitiveSectors: {
        controversialWeapons: false,
        controversialWeaponsRevenue: 0,
        tobacco: false,
        tobaccoRevenue: 0,
        fossilFuels: false,
        fossilFuelsRevenue: { coal: 0, oil: 0, gas: 0 },
        chemicals: false,
        chemicalsRevenue: 0
      },
      // BP 2 - Indice di diversità di genere
      genderDiversityIndex: 0,
      // BP 3 - Obiettivi di riduzione emissioni
      emissionReductionTargets: {
        hasTargets: false,
        scope1Target: 0,
        scope2Target: 0,
        scope3Target: 0,
        includesScope3: false
      },
      // BP 4 - Piano di transizione
      transitionPlan: {
        hasPlan: false,
        planDetails: ""
      },
      // BP 5 - Rischi fisici climatici
      physicalRisks: {
        exposed: false,
        assetsAtRisk: 0,
        assetsAtRiskPercentage: 0,
        adaptationPercentage: 0,
        revenueAtRisk: 0,
        revenueAtRiskPercentage: 0,
        energyEfficiencyClasses: {
          classA: 0,
          classB: 0,
          classC: 0,
          classD: 0,
          classE: 0,
          classF: 0,
          classG: 0
        }
      },
      // BP 6 - Rifiuti pericolosi
      hazardousWaste: {
        produces: false,
        quantity: 0
      },
      // BP 7-9 - Allineamento con strumenti internazionali
      internationalStandards: {
        aligned: false,
        hasMonitoringProcesses: false,
        violations: false
      },
      // BP 10 - Equilibrio vita-lavoro
      workLifeBalance: {
        eligibleMale: 0,
        eligibleFemale: 0,
        takenMale: 0,
        takenFemale: 0
      },
      // BP 11 - Apprendisti
      apprentices: {
        has: false,
        count: 0
      }
    }
  );

  // Aggiorna il formValues quando businessPartners cambia
  React.useEffect(() => {
    setFormValues(prev => ({
      ...prev,
      businessPartners
    }));
  }, [businessPartners, setFormValues]);

  const updateBusinessPartners = (path: string, value: any) => {
    setBusinessPartners(prev => {
      const newState = { ...prev };
      const keys = path.split('.');
      let current = newState;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">Modulo Partner Commerciali</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Questo modulo contiene informazioni generalmente richieste dai partner commerciali, dagli investitori e dai finanziatori dell'impresa.
      </p>

      {/* BP 1 - Ricavi in alcuni settori */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Coins className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">BP 1 - Ricavi in alcuni settori</h3>
        </div>
        
        <div className="space-y-5">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Indicare se l'impresa è attiva in uno o più dei seguenti settori, indicando i relativi ricavi:
          </p>

          <div className="space-y-4">
            {/* Armi controverse */}
            <div className="p-4 border rounded-md">
              <div className="flex items-start space-x-2 mb-4">
                <Checkbox 
                  id="controversialWeapons" 
                  checked={businessPartners.sensitiveSectors.controversialWeapons}
                  onCheckedChange={(checked) => updateBusinessPartners('sensitiveSectors.controversialWeapons', checked === true)}
                />
                <div>
                  <Label htmlFor="controversialWeapons" className="font-medium">
                    Armi controverse (mine antiuomo, munizioni a grappolo, armi chimiche e biologiche)
                  </Label>
                </div>
              </div>
              
              {businessPartners.sensitiveSectors.controversialWeapons && (
                <div className="ml-6">
                  <Label htmlFor="controversialWeaponsRevenue">Ricavi (€)</Label>
                  <Input
                    id="controversialWeaponsRevenue"
                    type="number"
                    min="0"
                    value={businessPartners.sensitiveSectors.controversialWeaponsRevenue}
                    onChange={(e) => updateBusinessPartners('sensitiveSectors.controversialWeaponsRevenue', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            {/* Tabacco */}
            <div className="p-4 border rounded-md">
              <div className="flex items-start space-x-2 mb-4">
                <Checkbox 
                  id="tobacco" 
                  checked={businessPartners.sensitiveSectors.tobacco}
                  onCheckedChange={(checked) => updateBusinessPartners('sensitiveSectors.tobacco', checked === true)}
                />
                <div>
                  <Label htmlFor="tobacco" className="font-medium">
                    Coltivazione e produzione di tabacco
                  </Label>
                </div>
              </div>
              
              {businessPartners.sensitiveSectors.tobacco && (
                <div className="ml-6">
                  <Label htmlFor="tobaccoRevenue">Ricavi (€)</Label>
                  <Input
                    id="tobaccoRevenue"
                    type="number"
                    min="0"
                    value={businessPartners.sensitiveSectors.tobaccoRevenue}
                    onChange={(e) => updateBusinessPartners('sensitiveSectors.tobaccoRevenue', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            {/* Combustibili fossili */}
            <div className="p-4 border rounded-md">
              <div className="flex items-start space-x-2 mb-4">
                <Checkbox 
                  id="fossilFuels" 
                  checked={businessPartners.sensitiveSectors.fossilFuels}
                  onCheckedChange={(checked) => updateBusinessPartners('sensitiveSectors.fossilFuels', checked === true)}
                />
                <div>
                  <Label htmlFor="fossilFuels" className="font-medium">
                    Settore dei combustibili fossili (carbone, petrolio e gas)
                  </Label>
                </div>
              </div>
              
              {businessPartners.sensitiveSectors.fossilFuels && (
                <div className="ml-6 space-y-3">
                  <div>
                    <Label htmlFor="coalRevenue">Ricavi da carbone (€)</Label>
                    <Input
                      id="coalRevenue"
                      type="number"
                      min="0"
                      value={businessPartners.sensitiveSectors.fossilFuelsRevenue.coal}
                      onChange={(e) => updateBusinessPartners('sensitiveSectors.fossilFuelsRevenue.coal', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="oilRevenue">Ricavi da petrolio (€)</Label>
                    <Input
                      id="oilRevenue"
                      type="number"
                      min="0"
                      value={businessPartners.sensitiveSectors.fossilFuelsRevenue.oil}
                      onChange={(e) => updateBusinessPartners('sensitiveSectors.fossilFuelsRevenue.oil', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gasRevenue">Ricavi da gas (€)</Label>
                    <Input
                      id="gasRevenue"
                      type="number"
                      min="0"
                      value={businessPartners.sensitiveSectors.fossilFuelsRevenue.gas}
                      onChange={(e) => updateBusinessPartners('sensitiveSectors.fossilFuelsRevenue.gas', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Produzione di sostanze chimiche */}
            <div className="p-4 border rounded-md">
              <div className="flex items-start space-x-2 mb-4">
                <Checkbox 
                  id="chemicals" 
                  checked={businessPartners.sensitiveSectors.chemicals}
                  onCheckedChange={(checked) => updateBusinessPartners('sensitiveSectors.chemicals', checked === true)}
                />
                <div>
                  <Label htmlFor="chemicals" className="font-medium">
                    Produzione di sostanze chimiche (pesticidi e altri prodotti agrochimici)
                  </Label>
                </div>
              </div>
              
              {businessPartners.sensitiveSectors.chemicals && (
                <div className="ml-6">
                  <Label htmlFor="chemicalsRevenue">Ricavi (€)</Label>
                  <Input
                    id="chemicalsRevenue"
                    type="number"
                    min="0"
                    value={businessPartners.sensitiveSectors.chemicalsRevenue}
                    onChange={(e) => updateBusinessPartners('sensitiveSectors.chemicalsRevenue', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassmorphicCard>

      {/* BP 2 - Indice di diversità di genere negli organi di governance */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Users className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">BP 2 - Indice di diversità di genere</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Indicare l'indice di diversità di genere nell'organo di governance dell'impresa.
          </p>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="genderDiversitySlider">
              Percentuale di donne nell'organo di governance: {businessPartners.genderDiversityIndex}%
            </Label>
            <Slider
              id="genderDiversitySlider"
              min={0}
              max={100}
              step={1}
              value={[businessPartners.genderDiversityIndex]}
              onValueChange={(values) => updateBusinessPartners('genderDiversityIndex', values[0])}
            />
          </div>
        </div>
      </GlassmorphicCard>

      {/* BP 3 - Obiettivi di riduzione delle emissioni di gas a effetto serra */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Leaf className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">BP 3 - Obiettivi di riduzione delle emissioni</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="hasEmissionTargets" 
              checked={businessPartners.emissionReductionTargets.hasTargets}
              onCheckedChange={(checked) => updateBusinessPartners('emissionReductionTargets.hasTargets', checked === true)}
            />
            <Label htmlFor="hasEmissionTargets" className="font-medium">
              L'impresa ha fissato obiettivi di riduzione delle emissioni di gas a effetto serra
            </Label>
          </div>
          
          {businessPartners.emissionReductionTargets.hasTargets && (
            <div className="space-y-4 mt-2 ml-6">
              <div>
                <Label htmlFor="scope1Target">
                  Obiettivo di riduzione per le emissioni di Ambito 1 (%)
                </Label>
                <Input
                  id="scope1Target"
                  type="number"
                  min="0"
                  max="100"
                  value={businessPartners.emissionReductionTargets.scope1Target}
                  onChange={(e) => updateBusinessPartners('emissionReductionTargets.scope1Target', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="scope2Target">
                  Obiettivo di riduzione per le emissioni di Ambito 2 (%)
                </Label>
                <Input
                  id="scope2Target"
                  type="number"
                  min="0"
                  max="100"
                  value={businessPartners.emissionReductionTargets.scope2Target}
                  onChange={(e) => updateBusinessPartners('emissionReductionTargets.scope2Target', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="includesScope3" 
                  checked={businessPartners.emissionReductionTargets.includesScope3}
                  onCheckedChange={(checked) => updateBusinessPartners('emissionReductionTargets.includesScope3', checked === true)}
                />
                <Label htmlFor="includesScope3">
                  L'impresa include e comunica anche le emissioni di Ambito 3
                </Label>
              </div>
              
              {businessPartners.emissionReductionTargets.includesScope3 && (
                <div>
                  <Label htmlFor="scope3Target">
                    Obiettivo di riduzione per le emissioni di Ambito 3 (%)
                  </Label>
                  <Input
                    id="scope3Target"
                    type="number"
                    min="0"
                    max="100"
                    value={businessPartners.emissionReductionTargets.scope3Target}
                    onChange={(e) => updateBusinessPartners('emissionReductionTargets.scope3Target', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </GlassmorphicCard>

      {/* BP 4 - Piano di transizione per la mitigazione dei cambiamenti climatici */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Globe className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">BP 4 - Piano di transizione climatica</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="hasTransitionPlan" 
              checked={businessPartners.transitionPlan.hasPlan}
              onCheckedChange={(checked) => updateBusinessPartners('transitionPlan.hasPlan', checked === true)}
            />
            <Label htmlFor="hasTransitionPlan" className="font-medium">
              L'impresa ha adottato un piano di transizione per la mitigazione dei cambiamenti climatici
            </Label>
          </div>
          
          {businessPartners.transitionPlan.hasPlan && (
            <div className="mt-2 ml-6">
              <Label htmlFor="transitionPlanDetails">
                Dettagli del piano di transizione e compatibilità con l'Accordo di Parigi (limitazione del riscaldamento a 1.5°C)
              </Label>
              <textarea
                id="transitionPlanDetails"
                value={businessPartners.transitionPlan.planDetails}
                onChange={(e) => updateBusinessPartners('transitionPlan.planDetails', e.target.value)}
                rows={5}
                className="w-full mt-1 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descrivere come gli obiettivi di riduzione delle emissioni sono compatibili con l'Accordo di Parigi..."
              />
            </div>
          )}
        </div>
      </GlassmorphicCard>

      {/* BP 5 - Rischi fisici da cambiamento climatico */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Zap className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">BP 5 - Rischi fisici da cambiamento climatico</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="exposedToRisks" 
              checked={businessPartners.physicalRisks.exposed}
              onCheckedChange={(checked) => updateBusinessPartners('physicalRisks.exposed', checked === true)}
            />
            <Label htmlFor="exposedToRisks" className="font-medium">
              L'impresa è esposta a rischi fisici rilevanti derivanti dal cambiamento climatico
            </Label>
          </div>
          
          {businessPartners.physicalRisks.exposed && (
            <div className="space-y-4 mt-2 ml-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assetsAtRisk">
                    Importo monetario degli attivi a rischio (€)
                  </Label>
                  <Input
                    id="assetsAtRisk"
                    type="number"
                    min="0"
                    value={businessPartners.physicalRisks.assetsAtRisk}
                    onChange={(e) => updateBusinessPartners('physicalRisks.assetsAtRisk', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="assetsAtRiskPercentage">
                    Percentuale degli attivi totali a rischio (%)
                  </Label>
                  <Input
                    id="assetsAtRiskPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={businessPartners.physicalRisks.assetsAtRiskPercentage}
                    onChange={(e) => updateBusinessPartners('physicalRisks.assetsAtRiskPercentage', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="adaptationPercentage">
                  Quota di attivi soggetti a rischio interessati da azioni di adattamento (%)
                </Label>
                <Input
                  id="adaptationPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={businessPartners.physicalRisks.adaptationPercentage}
                  onChange={(e) => updateBusinessPartners('physicalRisks.adaptationPercentage', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="revenueAtRisk">
                    Importo monetario dei ricavi a rischio (€)
                  </Label>
                  <Input
                    id="revenueAtRisk"
                    type="number"
                    min="0"
                    value={businessPartners.physicalRisks.revenueAtRisk}
                    onChange={(e) => updateBusinessPartners('physicalRisks.revenueAtRisk', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="revenueAtRiskPercentage">
                    Percentuale dei ricavi netti a rischio (%)
                  </Label>
                  <Input
                    id="revenueAtRiskPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={businessPartners.physicalRisks.revenueAtRiskPercentage}
                    onChange={(e) => updateBusinessPartners('physicalRisks.revenueAtRiskPercentage', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label className="font-medium mb-2 block">
                  Ripartizione del valore contabile delle attività immobiliari per classi di efficienza energetica (%)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <Label htmlFor="classA">Classe A</Label>
                    <Input
                      id="classA"
                      type="number"
                      min="0"
                      max="100"
                      value={businessPartners.physicalRisks.energyEfficiencyClasses.classA}
                      onChange={(e) => updateBusinessPartners('physicalRisks.energyEfficiencyClasses.classA', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="classB">Classe B</Label>
                    <Input
                      id="classB"
                      type="number"
                      min="0"
                      max="100"
                      value={businessPartners.physicalRisks.energyEfficiencyClasses.classB}
                      onChange={(e) => updateBusinessPartners('physicalRisks.energyEfficiencyClasses.classB', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="classC">Classe C</Label>
                    <Input
                      id="classC"
                      type="number"
                      min="0"
                      max="100"
                      value={businessPartners.physicalRisks.energyEfficiencyClasses.classC}
                      onChange={(e) => updateBusinessPartners('physicalRisks.energyEfficiencyClasses.classC', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="classD">Classe D</Label>
                    <Input
                      id="classD"
                      type="number"
                      min="0"
                      max="100"
                      value={businessPartners.physicalRisks.energyEfficiencyClasses.classD}
                      onChange={(e) => updateBusinessPartners('physicalRisks.energyEfficiencyClasses.classD', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="classE">Classe E</Label>
                    <Input
                      id="classE"
                      type="number"
                      min="0"
                      max="100"
                      value={businessPartners.physicalRisks.energyEfficiencyClasses.classE}
                      onChange={(e) => updateBusinessPartners('physicalRisks.energyEfficiencyClasses.classE', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="classF">Classe F</Label>
                    <Input
                      id="classF"
                      type="number"
                      min="0"
                      max="100"
                      value={businessPartners.physicalRisks.energyEfficiencyClasses.classF}
                      onChange={(e) => updateBusinessPartners('physicalRisks.energyEfficiencyClasses.classF', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="classG">Classe G</Label>
                    <Input
                      id="classG"
                      type="number"
                      min="0"
                      max="100"
                      value={businessPartners.physicalRisks.energyEfficiencyClasses.classG}
                      onChange={(e) => updateBusinessPartners('physicalRisks.energyEfficiencyClasses.classG', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </GlassmorphicCard>

      {/* BP 6 - Indice rifiuti pericolosi e/o radioattivi */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <AlertTriangle className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">BP 6 - Rifiuti pericolosi e/o radioattivi</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="producesHazardousWaste" 
              checked={businessPartners.hazardousWaste.produces}
              onCheckedChange={(checked) => updateBusinessPartners('hazardousWaste.produces', checked === true)}
            />
            <Label htmlFor="producesHazardousWaste" className="font-medium">
              L'impresa genera rifiuti pericolosi e/o radioattivi
            </Label>
          </div>
          
          {businessPartners.hazardousWaste.produces && (
            <div className="mt-2 ml-6">
              <Label htmlFor="hazardousWasteQuantity">
                Quantità totale di rifiuti pericolosi e/o radioattivi prodotti (tonnellate)
              </Label>
              <Input
                id="hazardousWasteQuantity"
                type="number"
                min="0"
                value={businessPartners.hazardousWaste.quantity}
                onChange={(e) => updateBusinessPartners('hazardousWaste.quantity', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          )}
        </div>
      </GlassmorphicCard>

      {/* BP 7-9 - Standard internazionali e conformità */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Shield className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">BP 7-9 - Standard internazionali e conformità</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="internationalAlignment" 
              checked={businessPartners.internationalStandards.aligned}
              onCheckedChange={(checked) => updateBusinessPartners('internationalStandards.aligned', checked === true)}
            />
            <div>
              <Label htmlFor="internationalAlignment" className="font-medium">
                BP 7 - Le politiche relative alla forza lavoro sono allineate con gli strumenti riconosciuti a livello internazionale
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Inclusi i Principi guida delle Nazioni Unite su imprese e diritti umani
              </p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="monitoringProcesses" 
              checked={businessPartners.internationalStandards.hasMonitoringProcesses}
              onCheckedChange={(checked) => updateBusinessPartners('internationalStandards.hasMonitoringProcesses', checked === true)}
            />
            <div>
              <Label htmlFor="monitoringProcesses" className="font-medium">
                BP 8 - L'impresa dispone di processi per monitorare il rispetto delle Linee guida OCSE e dei Principi ONU
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Include meccanismi di gestione delle lamentele e dei reclami per affrontare le violazioni
              </p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="violations" 
              checked={businessPartners.internationalStandards.violations}
              onCheckedChange={(checked) => updateBusinessPartners('internationalStandards.violations', checked === true)}
            />
            <div>
              <Label htmlFor="violations" className="font-medium">
                BP 9 - Nell'anno di riferimento si sono verificate violazioni dei Principi ONU, della Dichiarazione ILO o delle Linee guida OCSE
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                In relazione alla forza lavoro dell'impresa
              </p>
            </div>
          </div>
        </div>
      </GlassmorphicCard>

      {/* BP 10 - Equilibrio tra vita professionale e vita privata */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Clock className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">BP 10 - Equilibrio vita-lavoro</h3>
        </div>
        
        <div className="space-y-5">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Indicare le percentuali dei dipendenti che hanno diritto a usufruire del congedo per motivi familiari e che ne hanno effettivamente usufruito.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Diritto al congedo familiare</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="eligibleMale">
                    Uomini aventi diritto (%)
                  </Label>
                  <Input
                    id="eligibleMale"
                    type="number"
                    min="0"
                    max="100"
                    value={businessPartners.workLifeBalance.eligibleMale}
                    onChange={(e) => updateBusinessPartners('workLifeBalance.eligibleMale', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="eligibleFemale">
                    Donne aventi diritto (%)
                  </Label>
                  <Input
                    id="eligibleFemale"
                    type="number"
                    min="0"
                    max="100"
                    value={businessPartners.workLifeBalance.eligibleFemale}
                    onChange={(e) => updateBusinessPartners('workLifeBalance.eligibleFemale', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Fruizione del congedo familiare</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="takenMale">
                    Uomini che hanno utilizzato il congedo (%)
                  </Label>
                  <Input
                    id="takenMale"
                    type="number"
                    min="0"
                    max="100"
                    value={businessPartners.workLifeBalance.takenMale}
                    onChange={(e) => updateBusinessPartners('workLifeBalance.takenMale', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="takenFemale">
                    Donne che hanno utilizzato il congedo (%)
                  </Label>
                  <Input
                    id="takenFemale"
                    type="number"
                    min="0"
                    max="100"
                    value={businessPartners.workLifeBalance.takenFemale}
                    onChange={(e) => updateBusinessPartners('workLifeBalance.takenFemale', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <Info className="inline-block mr-1 h-4 w-4" /> Il congedo per motivi familiari comprende congedo di maternità, di paternità, parentale e per i prestatori di assistenza.
            </p>
          </div>
        </div>
      </GlassmorphicCard>

      {/* BP 11 - Numero di apprendisti */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <BarChart4 className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">BP 11 - Numero di apprendisti</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="hasApprentices" 
              checked={businessPartners.apprentices.has}
              onCheckedChange={(checked) => updateBusinessPartners('apprentices.has', checked === true)}
            />
            <Label htmlFor="hasApprentices" className="font-medium">
              L'impresa ha apprendisti
            </Label>
          </div>
          
          {businessPartners.apprentices.has && (
            <div className="mt-2 ml-6">
              <Label htmlFor="apprenticesCount">
                Numero di apprendisti nel periodo di riferimento
              </Label>
              <Input
                id="apprenticesCount"
                type="number"
                min="0"
                value={businessPartners.apprentices.count}
                onChange={(e) => updateBusinessPartners('apprentices.count', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          )}
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default BusinessPartnersMetrics;
