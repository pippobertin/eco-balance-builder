
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MoveRight, Info } from 'lucide-react';
import { MaterialityIssue } from '../types';
import { predefinedIssues } from '../utils/materialityUtils';
import { 
  categorizeIssuesByESG, 
  translateESGCategory,
  ESGCategorizedIssues,
  PredefinedIssue
} from '../utils/esgCategoryUtils';
import NoIssuesFound from './NoIssuesFound';

interface DragDropThemesProps {
  selectedIssues: MaterialityIssue[];
  onIssueSelect: (issue: { id: string; name: string; description: string }) => void;
  onIssueRemove: (id: string) => void;
}

const DragDropThemes: React.FC<DragDropThemesProps> = ({
  selectedIssues,
  onIssueSelect,
  onIssueRemove
}) => {
  const [activeTab, setActiveTab] = useState('environment');
  const [categories, setCategories] = useState<ESGCategorizedIssues>({
    environment: [],
    social: [],
    governance: []
  });
  
  const selectedIssueIds = selectedIssues.map(issue => issue.id);
  
  // Refresh categories every time component mounts or selectedIssues changes
  useEffect(() => {
    const categorizedIssues = categorizeIssuesByESG();
    console.log('Themes categorized by ESG:', categorizedIssues);
    console.log('Currently selected issues:', selectedIssues);
    setCategories(categorizedIssues);
  }, [selectedIssues]); // Re-run when selectedIssues changes to properly update available issues
  
  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, issue: PredefinedIssue) => {
    console.log('Drag started for issue:', issue.id);
    e.dataTransfer.setData('application/json', JSON.stringify(issue));
    e.currentTarget.classList.add('opacity-50');
  };
  
  // Handle drag end
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-green-50', 'border-green-300');
  };
  
  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-green-50', 'border-green-300');
  };
  
  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-green-50', 'border-green-300');
    
    try {
      const issueData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (!selectedIssueIds.includes(issueData.id)) {
        console.log("Adding issue via drop:", issueData);
        onIssueSelect(issueData);
      } else {
        console.log("Issue already selected, not adding duplicate:", issueData.id);
      }
    } catch (error) {
      console.error("Error during drop:", error);
    }
  };
  
  // Handle manual click to add an issue
  const handleAddIssue = (issue: PredefinedIssue) => {
    if (!selectedIssueIds.includes(issue.id)) {
      console.log("Adding issue via click:", issue);
      onIssueSelect(issue);
    } else {
      console.log("Issue already selected, not adding duplicate:", issue.id);
    }
  };
  
  // Filter available issues for each category
  const getAvailableIssues = (category: keyof ESGCategorizedIssues) => {
    return categories[category].filter(issue => !selectedIssueIds.includes(issue.id));
  };
  
  // Filter selected issues for each category
  const getSelectedIssuesForCategory = (category: keyof ESGCategorizedIssues) => {
    return selectedIssues.filter(issue => {
      const matchingPredefined = predefinedIssues.find(p => p.id === issue.id);
      return matchingPredefined && categories[category].some(c => c.id === issue.id);
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-md p-4 mb-4 border border-blue-100">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-sm">Come selezionare i temi materiali</h4>
            <p className="text-sm text-gray-700 mt-1">
              Trascina i temi che consideri materiali dalla colonna "Temi disponibili" alla colonna "Temi selezionati".
              Puoi navigare tra le categorie ESG utilizzando le schede sopra.
            </p>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="environment">Ambiente</TabsTrigger>
          <TabsTrigger value="social">Sociale</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>
        
        {(['environment', 'social', 'governance'] as const).map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
              {/* Available themes column */}
              <div className="w-full md:w-1/2">
                <h3 className="text-sm font-medium mb-2 text-gray-700">
                  Temi disponibili <span className="text-green-600 font-normal">(in verde quelli consigliati)</span>
                </h3>
                <div className="border rounded-md p-2 h-[400px] overflow-y-auto bg-gray-50">
                  {getAvailableIssues(category).length > 0 ? (
                    <div className="space-y-2">
                      {getAvailableIssues(category).map(issue => (
                        <div
                          key={issue.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, issue)}
                          onDragEnd={handleDragEnd}
                          onClick={() => handleAddIssue(issue)}
                          className="p-3 bg-white rounded border border-gray-200 cursor-pointer hover:border-green-300 hover:shadow-sm transition-all"
                        >
                          <h5 className="text-sm font-medium">{issue.name}</h5>
                          <p className="text-xs text-gray-600 mt-1">{issue.description}</p>
                          <button className="mt-2 text-xs text-blue-600 hover:text-blue-800">Clicca per aggiungere</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      Tutti i temi disponibili sono già stati selezionati
                    </p>
                  )}
                </div>
              </div>
              
              <div className="hidden md:flex items-center justify-center">
                <MoveRight className="h-8 w-8 text-gray-400" />
              </div>
              
              {/* Selected themes column */}
              <div className="w-full md:w-1/2">
                <h3 className="text-sm font-medium mb-2 text-gray-700">Temi selezionati</h3>
                <div 
                  className="border rounded-md p-2 h-[400px] overflow-y-auto bg-white border-dashed"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {getSelectedIssuesForCategory(category).length > 0 ? (
                    <div className="space-y-2">
                      {getSelectedIssuesForCategory(category).map(issue => (
                        <div key={issue.id} className="p-3 bg-green-50 rounded border border-green-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-sm font-medium">{issue.name}</h5>
                              <p className="text-xs text-gray-600 mt-1">{issue.description}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => onIssueRemove(issue.id)}
                            >
                              Rimuovi
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <NoIssuesFound />
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DragDropThemes;
