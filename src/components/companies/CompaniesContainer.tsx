
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/button';
import { useReport } from '@/context/ReportContext';
import { Building2, Plus } from 'lucide-react';
import CompanyList from './CompanyList';
import AddCompanyDialog from './dialogs/AddCompanyDialog';
import { useAuth } from '@/context/AuthContext';
import { Company } from '@/context/types';

const CompaniesContainer = () => {
  const { companies, currentCompany, setCurrentCompany } = useReport();
  const { isAdmin } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(currentCompany);
  
  // Use a ref to track if we're currently updating to prevent loops
  const isUpdatingRef = React.useRef(false);
  
  // Memoize the company selection handler
  const handleSelectCompany = useCallback((company: Company) => {
    // Skip if we're already in the middle of an update
    if (isUpdatingRef.current) return;
    
    // Skip if this company is already selected
    if (selectedCompany?.id === company.id) return;
    
    console.log("Handling company selection in container:", company.name);
    
    // Set the flag to prevent recursive updates
    isUpdatingRef.current = true;
    
    // Update local state first
    setSelectedCompany(company);
    
    // Then update the context
    setCurrentCompany(company);
    
    // Reset the flag after the current call stack is complete
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
  }, [selectedCompany, setCurrentCompany]);
  
  // Sync selectedCompany with currentCompany (one way only, from context to local)
  useEffect(() => {
    // Don't update if we're in the middle of a selection operation
    if (isUpdatingRef.current) return;
    
    if (currentCompany && (!selectedCompany || currentCompany.id !== selectedCompany.id)) {
      console.log("Syncing local selectedCompany with currentCompany:", currentCompany.name);
      setSelectedCompany(currentCompany);
    }
  }, [currentCompany, selectedCompany]);
  
  // Memoize the companies to prevent unnecessary re-renders
  const memoizedCompanies = useMemo(() => companies, [companies.length]);

  return (
    <GlassmorphicCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Building2 className="mr-2 h-5 w-5 text-blue-500" />
          Aziende
        </h2>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Nuova
        </Button>
      </div>
      
      <CompanyList 
        companies={memoizedCompanies} 
        selectedCompany={selectedCompany}
        onSelectCompany={handleSelectCompany}
        isAdmin={isAdmin}
      />
      
      <AddCompanyDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </GlassmorphicCard>
  );
};

export default React.memo(CompaniesContainer);
