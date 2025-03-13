
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
  const isHeader = isHeaderTheme(issue.id, issue.name);

  // Check if this is a category header by exact name match
  const isCategoryHeader = [
    'Cambiamenti climatici',
    'Biodiversità ed ecosistemi',
    'Inquinamento',
    'Acque e risorse marine',
    'Economia circolare',
    'Forza lavoro propria',
    'Lavoratori nella catena del valore',
    'Comunità interessate',
    'Consumatori e utilizzatori finali',
    'Condotta delle imprese'
  ].includes(issue.name);
  
  // Get the appropriate background color for different header categories - using more delicate colors
  const getHeaderBackgroundColor = (id: string, name: string) => {
    // Environmental headers - soft green
    if (id.includes('environmental') || 
        id.includes('climate') || 
        id.includes('biodiversity') || 
        id.includes('pollution') || 
        id.includes('water') || 
        id.includes('circular') ||
        name.includes('Cambiamenti climatici') ||
        name.includes('Biodiversità') ||
        name.includes('Inquinamento') ||
        name.includes('Acque') ||
        name.includes('Economia circolare')) {
      return 'bg-[#F2FCE2] border-[#E0F0C0]';
    }
    
    // Social headers - soft blue
    if (id.includes('social') || 
        id.includes('workforce') || 
        id.includes('communities') || 
        id.includes('consumers') ||
        name.includes('Forza lavoro') ||
        name.includes('Lavoratori') ||
        name.includes('Comunità') ||
        name.includes('Consumatori')) {
      return 'bg-[#D3E4FD] border-[#B9D5F9]';
    }
    
    // Governance headers - soft purple
    if (id.includes('governance') || 
        id.includes('conduct') ||
        name.includes('Condotta')) {
      return 'bg-[#E5DEFF] border-[#D0C9F0]';
    }
    
    return 'bg-gray-100 border-gray-200';
  };
  
  const isHeaderItem = isHeader || isCategoryHeader;

  // Handle the toggle of isMaterial
  const handleToggleIsMaterial = () => {
    const newValue = !issue.isMaterial;
    console.log(`IssueItem: Toggling isMaterial for ${issue.id} from ${issue.isMaterial} to ${newValue}`);
    onIssueChange(issue.id, 'isMaterial', newValue);
  };
  
  return (
    <div 
      className={`p-4 rounded-lg border mb-2 ${
        isHeaderItem
          ? `${getHeaderBackgroundColor(issue.id, issue.name)} font-semibold text-gray-800` 
          : 'bg-white border-gray-100 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className={`${isHeaderItem ? 'font-semibold text-gray-800 text-base' : 'text-sm font-medium text-gray-900'}`}>
            {issue.name}
          </h4>
          {issue.description && !isHeaderItem && (
            <p className="mt-1 text-sm text-gray-500">{issue.description}</p>
          )}
        </div>
        
        {/* Only show action buttons for non-header items */}
        {!isHeaderItem && (
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
              onClick={handleToggleIsMaterial}
              className={issue.isMaterial ? "text-green-600" : "text-gray-400"}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Show sliders only for material (selected) non-header issues */}
      {!isHeaderItem && issue.isMaterial === true && (
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
