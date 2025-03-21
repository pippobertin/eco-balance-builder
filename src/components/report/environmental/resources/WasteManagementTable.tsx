
import React, { useState } from 'react';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ResourcesTableHeader } from './components';
import { Info, Plus } from 'lucide-react';
import { useWasteEntries, WasteEntry } from './hooks/useWasteEntries';
import WasteEntryRow from './components/WasteEntryRow';
import WasteEntryForm from './components/WasteEntryForm';
import { useReport } from '@/hooks/use-report-context';

interface WasteManagementTableProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type FormMode = {
  isAdding: boolean;
  isEditing: boolean;
  wasteType: 'hazardous' | 'non-hazardous';
  currentEntry: WasteEntry | null;
};

const WasteManagementTable: React.FC<WasteManagementTableProps> = ({
  formValues,
  handleChange
}) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  
  const { nonHazardousEntries, hazardousEntries, refresh, loading } = useWasteEntries(reportId);
  
  const [formMode, setFormMode] = useState<FormMode>({
    isAdding: false,
    isEditing: false,
    wasteType: 'non-hazardous',
    currentEntry: null
  });
  
  const handleAddClick = (wasteType: 'hazardous' | 'non-hazardous') => {
    setFormMode({
      isAdding: true,
      isEditing: false,
      wasteType,
      currentEntry: null
    });
  };
  
  const handleEditClick = (entry: WasteEntry) => {
    setFormMode({
      isAdding: false,
      isEditing: true,
      wasteType: entry.waste_type,
      currentEntry: entry
    });
  };
  
  const handleFormCancel = () => {
    setFormMode({
      isAdding: false,
      isEditing: false,
      wasteType: 'non-hazardous',
      currentEntry: null
    });
  };
  
  const handleFormSaved = () => {
    refresh();
    handleFormCancel();
  };
  
  const isFormOpen = formMode.isAdding || formMode.isEditing;
  
  return (
    <div className="mt-4">
      <div className="p-3 rounded-md mb-4 bg-blue-50">
        <div className="flex items-start">
          <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
          <p className="text-sm text-slate-600">
            La tabella seguente mostra i rifiuti prodotti suddivisi per tipo. Inserisci i valori in tonnellate.
            Per i rifiuti pericolosi, considera batterie, olii usati, pesticidi, apparecchiature contenenti mercurio e lampade fluorescenti.
          </p>
        </div>
      </div>
      
      {isFormOpen && (
        <WasteEntryForm
          reportId={reportId}
          wasteType={formMode.wasteType}
          initialData={formMode.currentEntry}
          onSaved={handleFormSaved}
          onCancel={handleFormCancel}
        />
      )}
      
      <Table>
        <ResourcesTableHeader />
        <tbody>
          {/* Non-hazardous waste section */}
          <tr className="font-medium bg-gray-50">
            <td colSpan={4} className="p-2 text-sm">Rifiuti non pericolosi</td>
            <td className="p-2 text-right">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleAddClick('non-hazardous')}
                disabled={isFormOpen}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </td>
          </tr>
          
          {nonHazardousEntries.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-sm text-gray-500">
                {loading ? 'Caricamento...' : 'Nessun rifiuto non pericoloso registrato. Usa il pulsante "+" per aggiungerne uno.'}
              </td>
            </tr>
          ) : (
            nonHazardousEntries.map(entry => (
              <WasteEntryRow
                key={entry.id}
                id={entry.id}
                description={entry.waste_description}
                totalWaste={entry.total_waste}
                recycledWaste={entry.recycled_waste}
                disposalWaste={entry.disposal_waste}
                onEdit={() => handleEditClick(entry)}
                onDeleted={refresh}
              />
            ))
          )}
          
          {/* Hazardous waste section */}
          <tr className="font-medium bg-gray-50">
            <td colSpan={4} className="p-2 text-sm">Rifiuti pericolosi</td>
            <td className="p-2 text-right">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleAddClick('hazardous')}
                disabled={isFormOpen}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </td>
          </tr>
          
          {hazardousEntries.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-sm text-gray-500">
                {loading ? 'Caricamento...' : 'Nessun rifiuto pericoloso registrato. Usa il pulsante "+" per aggiungerne uno.'}
              </td>
            </tr>
          ) : (
            hazardousEntries.map(entry => (
              <WasteEntryRow
                key={entry.id}
                id={entry.id}
                description={entry.waste_description}
                totalWaste={entry.total_waste}
                recycledWaste={entry.recycled_waste}
                disposalWaste={entry.disposal_waste}
                onEdit={() => handleEditClick(entry)}
                onDeleted={refresh}
                isHazardous={true}
              />
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default WasteManagementTable;
