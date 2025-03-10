
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SurveyTemplate } from '../types';

interface SurveyCustomizerProps {
  surveyTemplate: SurveyTemplate;
  onSurveyTemplateChange: (updatedTemplate: SurveyTemplate) => void;
}

const SurveyCustomizer: React.FC<SurveyCustomizerProps> = ({
  surveyTemplate,
  onSurveyTemplateChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Personalizza il sondaggio</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="surveyTitle">Titolo del sondaggio</Label>
          <Input 
            id="surveyTitle"
            value={surveyTemplate.title}
            onChange={(e) => onSurveyTemplateChange({...surveyTemplate, title: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="surveyDescription">Descrizione</Label>
          <Textarea 
            id="surveyDescription"
            value={surveyTemplate.description}
            onChange={(e) => onSurveyTemplateChange({...surveyTemplate, description: e.target.value})}
            className="min-h-20"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="additionalComments" 
            checked={surveyTemplate.additionalComments}
            onCheckedChange={(checked) => 
              onSurveyTemplateChange({...surveyTemplate, additionalComments: checked === true})
            }
          />
          <Label htmlFor="additionalComments">
            Includere una sezione per commenti addizionali e altre questioni
          </Label>
        </div>
      </div>
    </div>
  );
};

export default SurveyCustomizer;
