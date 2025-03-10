
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
  // Get the available years, ensuring they're sorted with current year last
  const getYearsToDisplay = (): string[] => {
    if (availableYears && availableYears.length > 0) {
      // Convert reportYear to number for comparison
      const currentReportYear = parseInt(reportYear);
      
      // Filter and sort years
      const yearsList = availableYears
        .map(year => parseInt(year))
        .sort((a, b) => a - b); // Sort ascending
      
      const currentYearIndex = yearsList.indexOf(currentReportYear);
      if (currentYearIndex !== -1) {
        // Get up to two years before the current year
        const previousYears = yearsList
          .slice(Math.max(0, currentYearIndex - 2), currentYearIndex)
          .map(year => year.toString());
        
        // Add the current report year at the end
        return [...previousYears, reportYear];
      }
    }
    
    // Fallback: generate previous years based on report year
    const currentReportYear = parseInt(reportYear) || new Date().getFullYear();
    return [
      (currentReportYear - 2).toString(),
      (currentReportYear - 1).toString(),
      currentReportYear.toString()
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
