
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CheckCircle2, Send } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { MaterialityIssue, SurveyResponse } from '../types';

interface SurveyResponsePageProps {
  // In reale implementazione, queste informazioni verrebbero recuperate dal backend
  stakeholderId: string;
  companyName: string;
  issues: MaterialityIssue[];
  onSubmitResponse: (response: SurveyResponse) => void;
}

const SurveyResponsePage: React.FC<SurveyResponsePageProps> = ({
  stakeholderId,
  companyName,
  issues,
  onSubmitResponse
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  
  const [issueRatings, setIssueRatings] = useState<{
    issueId: string;
    relevance: number;
  }[]>(issues.map(issue => ({
    issueId: issue.id,
    relevance: 50 // Valore predefinito
  })));
  
  const [additionalComments, setAdditionalComments] = useState('');

  const handleRelevanceChange = (issueId: string, value: number) => {
    setIssueRatings(prev => 
      prev.map(rating => 
        rating.issueId === issueId 
          ? { ...rating, relevance: value } 
          : rating
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const response: SurveyResponse = {
      stakeholderId,
      companyName,
      responseDate: new Date().toISOString(),
      issueRatings,
      additionalComments: additionalComments.trim() || undefined
    };
    
    onSubmitResponse(response);
    setSubmitted(true);
    
    toast({
      title: "Risposta inviata",
      description: "Grazie per aver completato il sondaggio di materialità.",
    });
    
    // In un'implementazione reale, reindirizzare a una pagina di conferma
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {submitted ? (
        <GlassmorphicCard>
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Risposta inviata con successo!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Grazie per aver partecipato all'analisi di materialità di {companyName}.
              La tua valutazione è stata registrata.
            </p>
          </div>
        </GlassmorphicCard>
      ) : (
        <form onSubmit={handleSubmit}>
          <GlassmorphicCard>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-4">Analisi di Materialità - {companyName}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Il tuo contributo è fondamentale per identificare le questioni di sostenibilità più rilevanti.
                Ti chiediamo di valutare l'importanza di ciascuna delle seguenti questioni.
              </p>
            </div>
            
            <div className="space-y-8 mb-8">
              {issues.map((issue, index) => (
                <div key={issue.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800">
                  <h3 className="font-medium mb-2">{issue.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{issue.description}</p>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Rilevanza: {issueRatings.find(r => r.issueId === issue.id)?.relevance || 0}%</Label>
                    </div>
                    <Slider
                      value={[issueRatings.find(r => r.issueId === issue.id)?.relevance || 0]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleRelevanceChange(issue.id, value[0])}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Non rilevante</span>
                      <span>Molto rilevante</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <Label htmlFor="comments" className="block mb-2">Commenti aggiuntivi</Label>
              <Textarea
                id="comments"
                placeholder="Inserisci qui eventuali commenti o osservazioni aggiuntive..."
                rows={4}
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
              />
            </div>
            
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" />
              Invia valutazione
            </Button>
          </GlassmorphicCard>
        </form>
      )}
    </div>
  );
};

export default SurveyResponsePage;
