
import React from 'react';
import { Info, HelpCircle } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface InfoHoverCardProps {
  children: React.ReactNode;
}

const InfoHoverCard: React.FC<InfoHoverCardProps> = ({ children }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <span className="ml-1.5 inline-flex items-center cursor-help">
        <HelpCircle className="h-4 w-4 text-slate-500 hover:text-slate-700" />
      </span>
    </HoverCardTrigger>
    <HoverCardContent className="max-w-sm bg-blue-50 border-blue-200">
      <div className="flex items-start mb-2">
        <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
        {children}
      </div>
    </HoverCardContent>
  </HoverCard>
);

export default InfoHoverCard;
