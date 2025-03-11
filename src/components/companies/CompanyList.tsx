
import React, { useCallback, memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { Company } from '@/context/types';

interface CompanyListProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company) => void;
  isAdmin: boolean;
}

const CompanyList = ({ companies, selectedCompany, onSelectCompany, isAdmin }: CompanyListProps) => {
  // Create a memoized selection handler
  const handleSelectCompany = useCallback((company: Company) => {
    console.log("Company selected in CompanyList:", company.name);
    // Only trigger the callback if this is a new selection
    if (!selectedCompany || selectedCompany.id !== company.id) {
      onSelectCompany(company);
    }
  }, [onSelectCompany, selectedCompany]);
  
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
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(CompanyList);
