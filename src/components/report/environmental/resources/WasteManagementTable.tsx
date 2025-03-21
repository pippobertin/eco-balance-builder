
import React from 'react';
import { Table } from '@/components/ui/table';
import { ResourcesTableHeader, ResourcesTableRow } from './components';
import { Info } from 'lucide-react';

interface WasteManagementTableProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const WasteManagementTable: React.FC<WasteManagementTableProps> = ({
  formValues,
  handleChange
}) => {
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
      
      <Table>
        <ResourcesTableHeader />
        <tbody>
          <tr className="font-medium bg-gray-50">
            <td colSpan={4} className="p-2 text-sm">Rifiuti non pericolosi</td>
          </tr>
          <ResourcesTableRow
            label="Rifiuti generici"
            tooltipTitle="Rifiuti non pericolosi"
            tooltipContent="Include tutti i rifiuti non pericolosi che non rientrano in categorie specifiche"
            totalValue={formValues.environmentalMetrics?.totalWaste || null}
            recycledValue={formValues.environmentalMetrics?.recycledWaste || null}
            disposalValue={
              formValues.environmentalMetrics?.totalWaste && formValues.environmentalMetrics?.recycledWaste 
                ? formValues.environmentalMetrics.totalWaste - formValues.environmentalMetrics.recycledWaste 
                : null
            }
            totalFieldName="totalWaste"
            recycledFieldName="recycledWaste"
            disposalFieldName="disposalWaste"
            handleChange={handleChange}
          />
          <tr className="font-medium bg-gray-50">
            <td colSpan={4} className="p-2 text-sm">Rifiuti pericolosi</td>
          </tr>
          <ResourcesTableRow
            label="Rifiuti pericolosi"
            tooltipTitle="Rifiuti pericolosi"
            tooltipContent="Include batterie, olii usati, pesticidi, apparecchiature contenenti mercurio e lampade fluorescenti"
            totalValue={formValues.environmentalMetrics?.hazardousWaste || null}
            recycledValue={formValues.environmentalMetrics?.hazardousWasteRecycled || null}
            disposalValue={
              formValues.environmentalMetrics?.hazardousWaste && formValues.environmentalMetrics?.hazardousWasteRecycled 
                ? formValues.environmentalMetrics.hazardousWaste - formValues.environmentalMetrics.hazardousWasteRecycled 
                : null
            }
            totalFieldName="hazardousWaste"
            recycledFieldName="hazardousWasteRecycled"
            disposalFieldName="hazardousWasteDisposal"
            handleChange={handleChange}
            isHazardous={true}
          />
        </tbody>
      </Table>
    </div>
  );
};

export default WasteManagementTable;
