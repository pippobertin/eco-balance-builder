
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface TooltipRendererProps {
  title: string;
  content: string;
  children?: React.ReactNode;
}

const TooltipRenderer: React.FC<TooltipRendererProps> = ({ 
  title, 
  content, 
  children 
}) => {
  return (
    <div className="flex items-center">
      {children}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="ml-1 h-4 w-4 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-xs space-y-1">
              <h4 className="font-medium">{title}</h4>
              <p className="text-sm">{content}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TooltipRenderer;
