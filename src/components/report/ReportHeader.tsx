
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { FileBarChart, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Company, Report } from '@/context/types';

interface ReportHeaderProps {
  currentCompany: Company | null;
  handleSaveReport: () => Promise<void>;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ 
  currentCompany, 
  handleSaveReport 
}) => {
  const navigate = useNavigate();

  const viewDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      className="mb-4 flex flex-wrap items-center justify-between gap-4"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-baseline gap-2">
          Report V-SME
          {currentCompany && <span className="text-emerald-500 text-3xl font-bold">{currentCompany.name}</span>}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compila il tuo report di sostenibilità secondo lo standard V-SME
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleSaveReport}
        >
          <Save className="h-4 w-4" />
          Salva
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={viewDashboard}
        >
          <FileBarChart className="h-4 w-4" />
          Visualizza Dashboard
        </Button>
      </div>
    </motion.div>
  );
};

export default ReportHeader;
