
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Target, BriefcaseBusiness, Users, Building } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface NarrativePATMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const NarrativePATMetrics: React.FC<NarrativePATMetricsProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      narrativePATMetrics: {
        ...prev.narrativePATMetrics,
        [name]: value
      }
    }));
  };

  // Raggruppare gli stakeholder per categoria per una migliore visualizzazione
  const stakeholdersByCategory = React.useMemo(() => {
    if (!formValues.materialityAnalysis?.stakeholders || formValues.materialityAnalysis.stakeholders.length === 0) {
      return {};
    }

    return formValues.materialityAnalysis.stakeholders.reduce((acc: any, stakeholder: any) => {
      if (!acc[stakeholder.category]) {
        acc[stakeholder.category] = [];
      }
      acc[stakeholder.category].push(stakeholder);
      return acc;
    }, {});
  }, [formValues.materialityAnalysis?.stakeholders]);

  // Calcola statistiche per i sondaggi degli stakeholder
  const surveyStats = React.useMemo(() => {
    if (!formValues.materialityAnalysis?.stakeholders) {
      return { total: 0, sent: 0, completed: 0 };
    }

    const stakeholders = formValues.materialityAnalysis.stakeholders;
    return {
      total: stakeholders.length,
      sent: stakeholders.filter((s: any) => s.surveyStatus === 'sent').length,
      completed: stakeholders.filter((s: any) => s.surveyStatus === 'completed').length
    };
  }, [formValues.materialityAnalysis?.stakeholders]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Modulo Narrativo - Politiche, Azioni e Obiettivi (PAT)</h2>
      
      {/* N1 - Strategia: modello aziendale e iniziative di sostenibilità */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <BriefcaseBusiness className="mr-2 h-5 w-5 text-indigo-500" />
          <h3 className="text-xl font-semibold">N1 - Strategia: modello aziendale e iniziative di sostenibilità</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="productsServices">Gruppi significativi di prodotti e/o servizi offerti</Label>
            <Textarea
              id="productsServices"
              name="productsServices"
              placeholder="Descrivi i principali prodotti e servizi offerti dalla tua impresa"
              value={formValues.narrativePATMetrics?.productsServices || ""}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="markets">Mercati significativi in cui opera l'impresa</Label>
            <Textarea
              id="markets"
              name="markets"
              placeholder="Descrivi i mercati principali (B2B, commercio all'ingrosso, commercio al dettaglio, paesi)"
              value={formValues.narrativePATMetrics?.markets || ""}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="businessRelations">Principali relazioni commerciali</Label>
            <Textarea
              id="businessRelations"
              name="businessRelations"
              placeholder="Descrivi i principali fornitori, clienti, canali di distribuzione e consumatori"
              value={formValues.narrativePATMetrics?.businessRelations || ""}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="sustainabilityStrategy">Elementi chiave della strategia legati alla sostenibilità</Label>
            <Textarea
              id="sustainabilityStrategy"
              name="sustainabilityStrategy"
              placeholder="Descrivi gli elementi chiave della strategia aziendale che riguardano o influenzano le questioni di sostenibilità (se applicabile)"
              value={formValues.narrativePATMetrics?.sustainabilityStrategy || ""}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* N2 - Questioni rilevanti di sostenibilità */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Target className="mr-2 h-5 w-5 text-indigo-500" />
          <h3 className="text-xl font-semibold">N2 - Questioni rilevanti di sostenibilità</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Descrivi le questioni di sostenibilità rilevanti risultanti dalla valutazione della materialità, illustrando:
            <br />- come ciascuna questione impatta sulle persone o sull'ambiente
            <br />- gli effetti reali e potenziali sulla situazione patrimoniale-finanziaria e sul risultato finanziario
            <br />- gli effetti reali e potenziali sulle attività e sulla strategia dell'impresa
          </p>
          
          <div>
            <Label htmlFor="materialIssuesDescription">Questioni di sostenibilità materiali</Label>
            <Textarea
              id="materialIssuesDescription"
              name="materialIssuesDescription"
              placeholder="Descrivi le questioni di sostenibilità rilevanti identificate attraverso l'analisi di materialità"
              value={formValues.narrativePATMetrics?.materialIssuesDescription || ""}
              onChange={handleChange}
              className="min-h-[150px]"
            />
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* N3 - Gestione delle questioni rilevanti di sostenibilità */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <FileText className="mr-2 h-5 w-5 text-indigo-500" />
          <h3 className="text-xl font-semibold">N3 - Gestione delle questioni rilevanti di sostenibilità</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="policiesActions">Politiche e azioni adottate</Label>
            <Textarea
              id="policiesActions"
              name="policiesActions"
              placeholder="Descrivi le politiche o azioni adottate per prevenire, mitigare e/o rimediare ad impatti negativi"
              value={formValues.narrativePATMetrics?.policiesActions || ""}
              onChange={handleChange}
              className="min-h-[120px]"
            />
          </div>
          
          <div>
            <Label htmlFor="policiesDescription">Descrizione delle politiche</Label>
            <Textarea
              id="policiesDescription"
              name="policiesDescription"
              placeholder="Se sono state adottate politiche, descrivi: obiettivi, ambito di applicazione, portatori di interesse coinvolti, riferimenti a principi/iniziative di terzi, obiettivi di monitoraggio"
              value={formValues.narrativePATMetrics?.policiesDescription || ""}
              onChange={handleChange}
              className="min-h-[120px]"
            />
          </div>
          
          <div>
            <Label htmlFor="actionsDescription">Descrizione delle azioni</Label>
            <Textarea
              id="actionsDescription"
              name="actionsDescription"
              placeholder="Se sono state intraprese azioni, descrivi: azioni chiave intraprese nell'anno di riferimento, ambito di applicazione, orizzonte temporale, obiettivi di monitoraggio"
              value={formValues.narrativePATMetrics?.actionsDescription || ""}
              onChange={handleChange}
              className="min-h-[120px]"
            />
          </div>
          
          <div>
            <Label htmlFor="energyEfficiencyActions">Azioni per l'efficienza energetica</Label>
            <Textarea
              id="energyEfficiencyActions"
              name="energyEfficiencyActions"
              placeholder="Descrivi le azioni intraprese per migliorare l'efficienza energetica e ridurre le emissioni di gas serra (se rilevante)"
              value={formValues.narrativePATMetrics?.energyEfficiencyActions || ""}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="stakeholdersImpacts">Impatti sui portatori di interesse nella catena del valore</Label>
            <Textarea
              id="stakeholdersImpacts"
              name="stakeholdersImpacts"
              placeholder="Se rilevante, descrivi le politiche e azioni adottate per gestire gli impatti sui lavoratori nella catena del valore, consumatori e comunità interessate"
              value={formValues.narrativePATMetrics?.stakeholdersImpacts || ""}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="antiCorruptionMeasures">Misure anti-corruzione</Label>
            <Textarea
              id="antiCorruptionMeasures"
              name="antiCorruptionMeasures"
              placeholder="Se rilevante, descrivi le misure adottate per prevenire episodi di corruzione (separazione delle funzioni, formazione dipendenti, azioni per affrontare violazioni)"
              value={formValues.narrativePATMetrics?.antiCorruptionMeasures || ""}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* N4 - Principali portatori di interessi */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Users className="mr-2 h-5 w-5 text-indigo-500" />
          <h3 className="text-xl font-semibold">N4 - Principali portatori di interessi</h3>
        </div>
        
        <div className="space-y-4">
          {Object.keys(stakeholdersByCategory).length > 0 ? (
            <>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm font-medium text-blue-700">
                  Questo elenco è generato automaticamente dagli stakeholder mappati nell'analisi di materialità.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Categorie di portatori di interessi chiave</h4>
                <div className="space-y-3">
                  {Object.entries(stakeholdersByCategory).map(([category, stakeholders]: [string, any]) => (
                    <div key={category} className="bg-gray-50 p-3 rounded-md">
                      <h5 className="font-medium text-gray-800">{category}</h5>
                      <ul className="mt-1 pl-4 list-disc">
                        {stakeholders.map((stakeholder: any) => (
                          <li key={stakeholder.id} className="text-sm">
                            {stakeholder.name}
                            {stakeholder.priority && (
                              <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                Priorità: {stakeholder.priority}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Attività di coinvolgimento</h4>
                {surveyStats.sent > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      Gli stakeholder sono stati coinvolti attraverso un sondaggio di materialità per valutare 
                      la rilevanza delle questioni di sostenibilità identificate dall'azienda.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className="text-sm px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md">
                        Stakeholder mappati: <strong>{surveyStats.total}</strong>
                      </div>
                      <div className="text-sm px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-md">
                        Sondaggi inviati: <strong>{surveyStats.sent}</strong>
                      </div>
                      <div className="text-sm px-3 py-1.5 bg-green-100 text-green-800 rounded-md">
                        Sondaggi completati: <strong>{surveyStats.completed}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Non sono ancora stati inviati sondaggi agli stakeholder. 
                      Visita la sezione Materialità per creare e inviare sondaggi agli stakeholder mappati.
                    </p>
                  </div>
                )}
                
                <div className="mt-4">
                  <Label htmlFor="stakeholderEngagement">Altre attività di coinvolgimento</Label>
                  <Textarea
                    id="stakeholderEngagement"
                    name="stakeholderEngagement"
                    placeholder="Descrivi altre attività di coinvolgimento degli stakeholder (workshop, interviste, focus group, ecc.)"
                    value={formValues.narrativePATMetrics?.stakeholderEngagement || ""}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <p className="text-sm text-amber-700">
                  Non sono stati ancora mappati stakeholder nell'analisi di materialità. 
                  Visita la sezione Materialità per mappare gli stakeholder rilevanti per la tua organizzazione.
                </p>
              </div>
              
              <div>
                <Label htmlFor="keyStakeholders">Categorie di portatori di interessi chiave</Label>
                <Textarea
                  id="keyStakeholders"
                  name="keyStakeholders"
                  placeholder="Elenca le categorie di portatori di interessi chiave considerate (es. investitori, banche, partner commerciali, sindacati, ONG)"
                  value={formValues.narrativePATMetrics?.keyStakeholders || ""}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <Label htmlFor="stakeholderEngagement">Attività di coinvolgimento</Label>
                <Textarea
                  id="stakeholderEngagement"
                  name="stakeholderEngagement"
                  placeholder="Descrivi brevemente le attività di coinvolgimento dei portatori di interesse"
                  value={formValues.narrativePATMetrics?.stakeholderEngagement || ""}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
        </div>
      </GlassmorphicCard>
      
      {/* N5 - Governance: responsabilità in materia di sostenibilità */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Building className="mr-2 h-5 w-5 text-indigo-500" />
          <h3 className="text-xl font-semibold">N5 - Governance: responsabilità in materia di sostenibilità</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="sustainabilityGovernance">Governance e responsabilità sulla sostenibilità</Label>
            <Textarea
              id="sustainabilityGovernance"
              name="sustainabilityGovernance"
              placeholder="Descrivi la governance e le responsabilità in relazione alle questioni di sostenibilità (ruoli e responsabilità del più alto organo di governance o persone incaricate)"
              value={formValues.narrativePATMetrics?.sustainabilityGovernance || ""}
              onChange={handleChange}
              className="min-h-[120px]"
            />
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default NarrativePATMetrics;
