
import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  reportYear: string;
  companyName?: string;
  availableYears?: string[];
}

const DashboardHeader = ({ selectedYear, setSelectedYear, reportYear, companyName, availableYears = [] }: DashboardHeaderProps) => {
  // Sort available years in ascending order
  const yearsToDisplay = [...availableYears].sort((a, b) => parseInt(a) - parseInt(b));
  
  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-baseline gap-2">
            Dashboard delle Performance ESG
            {companyName && <span className="text-emerald-500 text-3xl font-bold">{companyName}</span>}
          </h1>
          <p className="text-esg-gray-medium">Monitora e analizza i tuoi indicatori di sostenibilità</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {yearsToDisplay.length > 0 && (
            <div className="glass p-2 rounded-lg flex items-center space-x-2">
              {yearsToDisplay.map((year) => (
                <Button 
                  key={year}
                  variant="ghost" 
                  size="sm" 
                  className={selectedYear === year ? "bg-esg-blue text-white" : ""} 
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </Button>
              ))}
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="border-esg-blue">
              <Filter className="h-4 w-4 mr-2" />
              Filtri
            </Button>
            
            <Button className="bg-esg-blue hover:bg-esg-blue/90">
              <Download className="h-4 w-4 mr-2" />
              Esporta
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHeader;
