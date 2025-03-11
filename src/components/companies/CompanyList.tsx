
import React, { useEffect, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { Company } from '@/context/types';
import { useReport } from '@/context/ReportContext';

interface CompanyListProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company) => void;
  isAdmin: boolean;
}

const CompanyList = ({ companies, selectedCompany, onSelectCompany, isAdmin }: CompanyListProps) => {
  const { currentCompany, setCurrentCompany } = useReport();
  
  // Memoized selection handler to prevent closures capturing stale props
  const handleSelectCompany = useCallback((company: Company) => {
    console.log("Company selected in handler:", company.name);
    onSelectCompany(company);
  }, [onSelectCompany]);
  
  // Only sync currentCompany -> selectedCompany when needed (one-way)
  useEffect(() => {
    if (currentCompany && (!selectedCompany || currentCompany.id !== selectedCompany.id)) {
      console.log("Updating selected company from currentCompany:", currentCompany.name);
      onSelectCompany(currentCompany);
    }
  }, [currentCompany, selectedCompany, onSelectCompany]);
  
  // Only sync selectedCompany -> currentCompany when needed (prevent loops)
  useEffect(() => {
    if (selectedCompany && (!currentCompany || selectedCompany.id !== currentCompany.id)) {
      console.log("Setting current company from CompanyList:", selectedCompany.name);
      setCurrentCompany(selectedCompany);
    }
  }, [selectedCompany, currentCompany, setCurrentCompany]);
  
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

export default React.memo(CompanyList);
