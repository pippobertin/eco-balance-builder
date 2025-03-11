
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  description?: string;
  glowColor?: string;
  onClick?: () => void;
}

const DashboardCard = ({
  title,
  value,
  change,
  icon,
  description,
  glowColor = "rgba(10, 132, 255, 0.1)",
  onClick
}: DashboardCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <GlassmorphicCard
      className="w-full h-full cursor-pointer"
      glowColor={glowColor}
      onClick={onClick}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          <div className="p-2 rounded-full bg-esg-blue/10">
            {icon}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            
            {change !== undefined && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center text-xs font-medium",
                  isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-esg-gray-medium"
                )}
              >
                {isPositive && <ArrowUp className="h-3 w-3 mr-0.5" />}
                {isNegative && <ArrowDown className="h-3 w-3 mr-0.5" />}
                {!isPositive && !isNegative && <ArrowRight className="h-3 w-3 mr-0.5" />}
                <span>{Math.abs(change)}%</span>
              </motion.div>
            )}
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default DashboardCard;
