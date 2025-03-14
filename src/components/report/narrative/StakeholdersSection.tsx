
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface StakeholdersSectionProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  stakeholdersByCategory: Record<string, any[]>;
  surveyStats: {
    total: number;
    sent: number;
    completed: number;
  };
}

const StakeholdersSection: React.FC<StakeholdersSectionProps> = ({ 
  formValues, 
  handleChange,
  stakeholdersByCategory,
  surveyStats
}) => {
  return (
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
  );
};

export default StakeholdersSection;
