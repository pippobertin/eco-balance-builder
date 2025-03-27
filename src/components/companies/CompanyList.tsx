
import React, { useCallback, memo } from 'react';
import { ChevronRight, Building } from 'lucide-react';
import { Company } from '@/context/types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CompanyListProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company) => void;
  isAdmin: boolean;
}

const CompanyList = ({ companies, selectedCompany, onSelectCompany, isAdmin }: CompanyListProps) => {
  const navigate = useNavigate();
  
  // Create a memoized selection handler
  const handleSelectCompany = useCallback((company: Company) => {
    console.log("CompanyList: Selecting company:", company.name);
    // Only trigger the callback if this is a new selection
    if (!selectedCompany || selectedCompany.id !== company.id) {
      onSelectCompany(company);
    }
  }, [onSelectCompany, selectedCompany]);
  
  // Handler for navigating to company profile
  const handleGoToProfile = useCallback((company: Company, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    console.log("CompanyList: Navigating to company profile for:", company.name);
    onSelectCompany(company);
    
    // Allow the company selection to complete before navigating
    setTimeout(() => {
      navigate('/company-profile');
    }, 50);
  }, [navigate, onSelectCompany]);
  
  if (companies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{isAdmin 
          ? "Nessuna azienda presente nel sistema."
          : "Non hai ancora creato nessuna azienda."
        }</p>
        <p className="text-sm">Crea la tua prima azienda per iniziare.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
      {companies.map((company) => (
        <div 
          key={company.id} 
          className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${
            selectedCompany?.id === company.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
          onClick={() => handleSelectCompany(company)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{company.name}</h3>
              {company.vat_number && (
                <p className="text-sm text-gray-500">P.IVA: {company.vat_number}</p>
              )}
              {company.country && (
                <p className="text-sm text-gray-500">{company.country}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                onClick={(e) => handleGoToProfile(company, e)}
                title="Vai all'anagrafica aziendale"
              >
                <Building className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:inline-block">Anagrafica</span>
              </Button>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(CompanyList);
