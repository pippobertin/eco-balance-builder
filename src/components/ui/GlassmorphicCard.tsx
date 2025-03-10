
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
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/70 border border-white/20 dark:border-white/10">
        {header && <CardHeader>{header}</CardHeader>}
        <CardContent>
          {children as React.ReactNode}
        </CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
      
      {/* Subtle glow effect */}
      <div 
        className="absolute -inset-0.5 rounded-xl opacity-30 blur-xl"
        style={{
          background: `radial-gradient(circle at top right, ${glowColor}, transparent 70%)`,
          zIndex: -1
        }}
      ></div>
    </motion.div>
  );
};

export default GlassmorphicCard;
