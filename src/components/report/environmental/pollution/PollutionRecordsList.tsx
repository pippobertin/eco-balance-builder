
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, PenLine } from 'lucide-react';
import { PollutionRecord, PollutantType, PollutionMedium } from '../hooks/usePollutionData';

interface PollutionRecordsListProps {
  records: PollutionRecord[];
  pollutants: PollutantType[];
  mediums: PollutionMedium[];
  onDeleteRecord: (id: string) => Promise<boolean>;
  onEditRecord: (record: PollutionRecord) => void;
  isLoading?: boolean;
  editingId?: string | null;
}

const PollutionRecordsList: React.FC<PollutionRecordsListProps> = ({
  records,
  pollutants,
  mediums,
  onDeleteRecord,
  onEditRecord,
  isLoading = false,
  editingId = null
}) => {
  // Get pollutant name by ID
  const getPollutantName = (id: number) => {
    return pollutants.find(p => p.id === id)?.name || 'Sconosciuto';
  };
  
  // Get medium name by ID
  const getMediumName = (id: number) => {
    return mediums.find(m => m.id === id)?.name || 'Sconosciuto';
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Caricamento dati sugli inquinanti...</p>
      </div>
    );
  }
  
  if (records.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-gray-500">Nessun dato sugli inquinanti registrato finora.</p>
        <p className="text-sm text-gray-400 mt-1">Utilizza il form sopra per aggiungere inquinanti.</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Inquinante</TableHead>
            <TableHead>Mezzo di Rilascio</TableHead>
            <TableHead>Quantità (kg)</TableHead>
            <TableHead>Note</TableHead>
            <TableHead className="w-[120px]">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow 
              key={record.id}
              className={editingId === record.id ? "bg-muted/50" : ""}
            >
              <TableCell className="font-medium">
                {getPollutantName(record.pollutant_type_id)}
              </TableCell>
              <TableCell>{getMediumName(record.release_medium_id)}</TableCell>
              <TableCell>{record.quantity}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {record.details || '-'}
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditRecord(record)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    disabled={editingId !== null}
                    title="Modifica"
                  >
                    <PenLine className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => record.id && onDeleteRecord(record.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={editingId !== null}
                    title="Elimina"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PollutionRecordsList;
