
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface TooltipRendererProps {
  title: string;
  content: string;
}

const TooltipRenderer: React.FC<TooltipRendererProps> = ({ title, content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 p-0">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Info about {title}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          align="start" 
          className="max-w-md p-4 z-50"
          avoidCollisions={true}
          collisionBoundary={null}
          sticky="always"
        >
          <div className="space-y-2">
            <p className="font-medium text-sm">{title}</p>
            <p className="text-xs">{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipRenderer;
