
import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

const DashboardHeader = ({ selectedYear, setSelectedYear }: DashboardHeaderProps) => {
  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold">ESG Performance Dashboard</h1>
          <p className="text-esg-gray-medium">Monitor and analyze your sustainability metrics</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="glass p-2 rounded-lg flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={selectedYear === "2021" ? "bg-esg-blue text-white" : ""} 
              onClick={() => setSelectedYear("2021")}
            >
              2021
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={selectedYear === "2022" ? "bg-esg-blue text-white" : ""} 
              onClick={() => setSelectedYear("2022")}
            >
              2022
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={selectedYear === "2023" ? "bg-esg-blue text-white" : ""} 
              onClick={() => setSelectedYear("2023")}
            >
              2023
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="border-esg-blue">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Button className="bg-esg-blue hover:bg-esg-blue/90">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHeader;
