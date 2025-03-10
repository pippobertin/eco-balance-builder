
import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  reportYear: string;
  companyName?: string;
}

const DashboardHeader = ({ selectedYear, setSelectedYear, reportYear, companyName }: DashboardHeaderProps) => {
  // We'll dynamically determine which years to show based on the report year
  const currentYear = new Date().getFullYear();
  
  // Create an array of years to display, including the report year and previous years
  const getYearsToDisplay = (): string[] => {
    const reportYearNum = parseInt(reportYear) || currentYear;
    
    // Show the report year and the two previous years if available
    return [
      (reportYearNum - 2).toString(),
      (reportYearNum - 1).toString(),
      reportYearNum.toString()
    ];
  };
  
  const yearsToDisplay = getYearsToDisplay();
  
  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard delle Performance ESG
            {companyName && <span className="text-esg-blue text-2xl ml-2">- {companyName}</span>}
          </h1>
          <p className="text-esg-gray-medium">Monitora e analizza i tuoi indicatori di sostenibilità</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
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
          
          <Button variant="outline" size="sm" className="border-esg-blue">
            <Filter className="h-4 w-4 mr-2" />
            Filtri
          </Button>
          
          <Button className="bg-esg-blue hover:bg-esg-blue/90">
            <Download className="h-4 w-4 mr-2" />
            Esporta
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHeader;
