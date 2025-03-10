
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Users, CheckCircle2, Send } from 'lucide-react';

interface SurveyProgressBarProps {
  sent: number;
  completed: number;
  total: number;
}

const SurveyProgressBar: React.FC<SurveyProgressBarProps> = ({ sent, completed, total }) => {
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm font-medium">Progresso sondaggi</span>
        </div>
        <span className="text-sm font-medium">{completionPercentage}%</span>
      </div>
      
      <Progress value={completionPercentage} className="h-2" />
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <div className="flex items-center">
          <Send className="h-3 w-3 mr-1 text-blue-500" />
          <span>Inviati: {sent}</span>
        </div>
        <div className="flex items-center">
          <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
          <span>Completati: {completed}</span>
        </div>
        <div>
          <span>Totale: {total}</span>
        </div>
      </div>
    </div>
  );
};

export default SurveyProgressBar;
