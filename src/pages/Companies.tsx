
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { useReport } from '@/context/ReportContext';
import { useAuth } from '@/context/AuthContext';
import CompaniesSection from '@/components/companies/CompaniesSection';
import ReportsSection from '@/components/companies/ReportsSection';
import DeleteReportDialog from '@/components/companies/DeleteReportDialog';
import { useReportDialogs } from '@/components/companies/hooks/useReportDialogs';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { debounce } from '@/integrations/supabase/client';

const Companies = () => {
  const { loadCompanies, companies, currentCompany } = useReport();
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(0);
  const { toast } = useToast();
  const loadingCompaniesRef = useRef(false);
  
  const { 
    reportToDelete, 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen,
    setReportToDelete,
    handleDeleteReport 
  } = useReportDialogs();
  
  // Create a debounced fetch function to prevent multiple rapid calls
  const debouncedFetchCompanies = useCallback(
    debounce(async () => {
      // Skip if already loading
      if (loadingCompaniesRef.current) {
        console.log("Skipping companies fetch - already loading");
        return;
      }
      
      loadingCompaniesRef.current = true;
      
      setIsLoading(true);
      setHasError(false);
      try {
        console.log("Fetching companies (attempt " + (loadingAttempts + 1) + ")");
        await loadCompanies();
        console.log("Companies fetched successfully:", companies.length);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setHasError(true);
        toast({
          title: "Errore di connessione",
          description: "Non è stato possibile caricare le aziende. Riproveremo automaticamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        setLoadingAttempts(prev => prev + 1);
        
        // Reset loading ref after a delay to allow state updates to complete
        setTimeout(() => {
          loadingCompaniesRef.current = false;
        }, 300); // Reduced from 500ms to 300ms for faster retries
      }
    }, 300), // Reduced from 500ms to 300ms for faster response
    [loadCompanies, loadingAttempts, toast]
  );
  
  // Initial load - only run once
  useEffect(() => {
    console.log("Initial companies fetch");
    debouncedFetchCompanies();
    
    // Add an additional timer to ensure companies load even if something goes wrong
    const backupTimer = setTimeout(() => {
      if (companies.length === 0 && !loadingCompaniesRef.current) {
        console.log("Backup companies fetch triggered");
        loadingCompaniesRef.current = false;
        debouncedFetchCompanies();
      }
    }, 2000);
    
    // Cleanup function to cancel pending requests
    return () => {
      console.log("Companies page unmounting, cleanup");
      clearTimeout(backupTimer);
    };
  }, []);
  
  // Only retry on error with backoff
  useEffect(() => {
    if (hasError && loadingAttempts < 3) {
      const timeout = Math.min(1500 * Math.pow(1.5, loadingAttempts), 5000);
      console.log(`Retrying companies fetch in ${timeout}ms (attempt ${loadingAttempts + 1})`);
      
      const timer = setTimeout(() => {
        if (!loadingCompaniesRef.current) {
          loadingCompaniesRef.current = false; // Force reset the flag
          debouncedFetchCompanies();
        }
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [hasError, loadingAttempts, debouncedFetchCompanies]);
  
  // Ensure the companies state is not empty
  const displayCompanies = companies.length > 0;
  
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
          
          {isLoading && loadingAttempts === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
              <span className="text-gray-600">Caricamento in corso...</span>
            </div>
          ) : hasError && loadingAttempts >= 3 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-red-500 mb-4">Si è verificato un problema di connessione al server.</p>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => {
                  setLoadingAttempts(0);
                  loadingCompaniesRef.current = false;
                  debouncedFetchCompanies();
                }}
              >
                Riprova
              </button>
            </div>
          ) : (
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
          )}
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
