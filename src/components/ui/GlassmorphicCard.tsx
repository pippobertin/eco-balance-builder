
import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface GlassmorphicCardProps extends HTMLMotionProps<"div"> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hover?: boolean;
  glowColor?: string;
}

const GlassmorphicCard = ({
  className,
  header,
  footer,
  hover = true,
  glowColor = "rgba(10, 132, 255, 0.1)",
  children,
  ...props
}: GlassmorphicCardProps) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, boxShadow: `0 20px 25px -5px ${glowColor}` } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        "overflow-hidden relative",
        className
      )}
      {...props}
    >
      <Card className="bg-white text-gray-900 border border-gray-200 shadow-sm">
        {header && <CardHeader className="text-gray-900">{header}</CardHeader>}
        <CardContent className="text-gray-800">
          {children as React.ReactNode}
        </CardContent>
        {footer && <CardFooter className="text-gray-900">{footer}</CardFooter>}
      </Card>
      
      <div 
        className="absolute -inset-0.5 rounded-xl opacity-20 blur-xl"
        style={{
          background: `radial-gradient(circle at top right, ${glowColor}, transparent 70%)`,
          zIndex: -1
        }}
      ></div>
    </motion.div>
  );
};

export default GlassmorphicCard;
