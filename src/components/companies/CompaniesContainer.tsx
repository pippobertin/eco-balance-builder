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
  
  console.log("CompaniesContainer rendered with companies:", companies);
  console.log("Current company:", currentCompany);
  
  const isUpdatingRef = React.useRef(false);
  
  const handleSelectCompany = useCallback((company: Company) => {
    if (isUpdatingRef.current) return;
    
    if (selectedCompany?.id === company.id) return;
    
    isUpdatingRef.current = true;
    
    setSelectedCompany(company);
    
    setCurrentCompany(company);
    
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
  }, [selectedCompany, setCurrentCompany]);
  
  useEffect(() => {
    if (isUpdatingRef.current) return;
    
    if (currentCompany && (!selectedCompany || currentCompany.id !== selectedCompany.id)) {
      setSelectedCompany(currentCompany);
    }
  }, [currentCompany, selectedCompany]);
  
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
      
      {companies.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Nessuna azienda trovata. Aggiungine una nuova.</p>
        </div>
      ) : (
        <CompanyList 
          companies={memoizedCompanies} 
          selectedCompany={selectedCompany}
          onSelectCompany={handleSelectCompany}
          isAdmin={isAdmin}
        />
      )}
      
      <AddCompanyDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </GlassmorphicCard>
  );
};

export default React.memo(CompaniesContainer);
