
import React from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { MaterialityIssue } from './types';
import { isHeaderTheme } from './utils/materialityUtils';

interface IssueItemProps {
  issue: MaterialityIssue;
  onIssueChange: (id: string, field: keyof MaterialityIssue, value: any) => void;
  onRemoveIssue?: (id: string) => void;
  isPredefined?: boolean;
}

const IssueItem: React.FC<IssueItemProps> = ({
  issue,
  onIssueChange,
  onRemoveIssue,
  isPredefined = false
}) => {
  // Check if this issue is a header theme
  const isHeader = isHeaderTheme(issue.id) || 
                   (issue.name && ['Cambiamenti climatici', 'Biodiversità ed ecosistemi', 'Inquinamento', 
                               'Acque e risorse marine', 'Economia circolare'].includes(issue.name));
  
  // Get the appropriate background color for different header categories
  const getHeaderBackgroundColor = (id: string) => {
    if (id.startsWith('environmental') || 
        id.includes('climate') || 
        id.includes('biodiversity') || 
        id.includes('pollution') || 
        id.includes('water') || 
        id.includes('circular')) return 'bg-green-200 border-green-300';
    
    if (id.startsWith('social') || 
        id.includes('workforce') || 
        id.includes('communities') || 
        id.includes('consumers')) return 'bg-blue-200 border-blue-300';
    
    if (id.startsWith('governance') || 
        id.includes('conduct')) return 'bg-purple-200 border-purple-300';
    
    return 'bg-gray-200 border-gray-300';
  };
  
  // Is this issue a category header like "Cambiamenti climatici"?
  const isCategoryHeader = issue.name === 'Cambiamenti climatici' || 
                          issue.name === 'Biodiversità ed ecosistemi' ||
                          issue.name === 'Inquinamento' ||
                          issue.name === 'Acque e risorse marine' ||
                          issue.name === 'Economia circolare';
  
  return (
    <div 
      className={`p-4 rounded-lg border mb-2 ${
        isHeader || isCategoryHeader
          ? `${getHeaderBackgroundColor(issue.id)} font-bold` 
          : 'bg-white border-gray-100 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className={`${isHeader || isCategoryHeader ? 'font-bold text-gray-900' : 'text-sm font-medium text-gray-900'}`}>
            {issue.name}
          </h4>
          {issue.description && !isHeader && !isCategoryHeader && (
            <p className="mt-1 text-sm text-gray-500">{issue.description}</p>
          )}
        </div>
        
        {/* Only show action buttons for non-header items */}
        {!isHeader && !isCategoryHeader && (
          <div className="flex items-center gap-2">
            {!isPredefined && onRemoveIssue && issue.isMaterial && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveIssue(issue.id)}
                className="text-red-600 hover:text-red-700"
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onIssueChange(issue.id, 'isMaterial', !issue.isMaterial)}
              className={issue.isMaterial ? "text-green-600" : "text-gray-400"}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Show sliders only for material (selected) non-header issues */}
      {!isHeader && !isCategoryHeader && issue.isMaterial && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-gray-900">Rilevanza di impatto: {issue.impactRelevance}%</Label>
            </div>
            <Slider
              value={[issue.impactRelevance]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => onIssueChange(issue.id, 'impactRelevance', value[0])}
              className="mb-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-gray-900">Rilevanza finanziaria: {issue.financialRelevance}%</Label>
            </div>
            <Slider
              value={[issue.financialRelevance]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => onIssueChange(issue.id, 'financialRelevance', value[0])}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueItem;
