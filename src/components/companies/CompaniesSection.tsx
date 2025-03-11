
import React, { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/button';
import { useReport } from '@/context/ReportContext';
import { useAuth } from '@/context/AuthContext';
import { Company } from '@/context/types';
import AddCompanyDialog from './dialogs/AddCompanyDialog';
import CompanyList from './CompanyList';
import { useReportContext } from './hooks/useReportContext';

const CompaniesSection = () => {
  const { companies } = useReport();
  const { isAdmin } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { selectedCompany, selectCompany } = useReportContext();

  return (
    <GlassmorphicCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Building2 className="mr-2 h-5 w-5 text-blue-500" />
          Aziende
        </h2>
        
        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuova
        </Button>
      </div>
      
      <CompanyList 
        companies={companies} 
        selectedCompany={selectedCompany}
        onSelectCompany={selectCompany}
        isAdmin={isAdmin}
      />
      
      <AddCompanyDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </GlassmorphicCard>
  );
};

export default CompaniesSection;
