import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SurveyTemplate } from '../types';
interface SurveyPreviewProps {
  surveyTemplate: SurveyTemplate;
}
const SurveyPreview: React.FC<SurveyPreviewProps> = ({
  surveyTemplate
}) => {
  return <div className="space-y-6 py-4">
      <div className="border rounded-md p-6 bg-slate-100">
        <h3 className="text-xl font-bold mb-4">{surveyTemplate.title}</h3>
        <p className="mb-6">{surveyTemplate.description}</p>
        
        <div className="space-y-8">
          {surveyTemplate.issues.map(issue => <div key={issue.id} className="space-y-3">
              <h4 className="font-medium">{issue.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{issue.description}</p>
              
              <div className="pt-2">
                <Label className="mb-2 block">
                  Quanto ritieni rilevante questa questione per la nostra organizzazione?
                </Label>
                <div className="flex flex-col space-y-2">
                  {[{
                value: '5',
                label: 'Estremamente rilevante'
              }, {
                value: '4',
                label: 'Molto rilevante'
              }, {
                value: '3',
                label: 'Moderatamente rilevante'
              }, {
                value: '2',
                label: 'Poco rilevante'
              }, {
                value: '1',
                label: 'Non rilevante'
              }].map(option => <div key={option.value} className="flex items-center space-x-2">
                      <input type="radio" name={`relevance-${issue.id}`} id={`relevance-${issue.id}-${option.value}`} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" disabled />
                      <Label htmlFor={`relevance-${issue.id}-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>)}
                </div>
              </div>
              
              <div className="pt-2">
                <Label htmlFor={`comments-${issue.id}`} className="mb-2 block">
                  Commenti o suggerimenti su questa questione (opzionale)
                </Label>
                <Textarea id={`comments-${issue.id}`} placeholder="Inserisci qui i tuoi commenti..." disabled />
              </div>
            </div>)}
        </div>
        
        {surveyTemplate.additionalComments && <div className="mt-8 space-y-3">
            <h4 className="font-medium">Altri temi rilevanti</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ci sono altre questioni di sostenibilità che ritieni rilevanti e che non sono state incluse in questo sondaggio?
            </p>
            <Textarea placeholder="Inserisci qui le tue osservazioni..." disabled />
          </div>}
        
        <div className="mt-8 pt-6 border-t">
          <Button disabled className="w-full">Invia le tue risposte</Button>
        </div>
      </div>
    </div>;
};
export default SurveyPreview;