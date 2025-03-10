
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { useReport } from '@/context/ReportContext';
import { useAuth } from '@/context/AuthContext';
import CompaniesSection from '@/components/companies/CompaniesSection';
import ReportsSection from '@/components/companies/ReportsSection';
import DeleteReportDialog from '@/components/companies/DeleteReportDialog';
import { useReportDialogs } from '@/components/companies/hooks/useReportDialogs';

const Companies = () => {
  const { loadCompanies } = useReport();
  const { isAdmin } = useAuth();
  const { 
    reportToDelete, 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen,
    setReportToDelete,
    handleDeleteReport 
  } = useReportDialogs();
  
  useEffect(() => {
    loadCompanies();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Gestione Aziende e Report</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isAdmin 
                ? "Gestisci tutte le aziende e i report nel sistema"
                : "Gestisci le tue aziende e i report di sostenibilità"
              }
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <CompaniesSection />
            </div>
            
            <div className="md:col-span-2">
              <ReportsSection 
                setReportToDelete={setReportToDelete}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              />
            </div>
          </div>
        </div>
      </main>
      
      <DeleteReportDialog 
        reportToDelete={reportToDelete}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onDelete={handleDeleteReport}
      />
      
      <Footer />
    </div>
  );
};

export default Companies;
