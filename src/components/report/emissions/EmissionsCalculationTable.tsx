
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmissionCalculationRecord } from '@/hooks/emissions-calculator';

interface EmissionsCalculationTableProps {
  scope: 'scope1' | 'scope2' | 'scope3';
  calculations: EmissionCalculationRecord[];
  onRemoveCalculation: (id: string) => void;
  scopeLabel: string;
}

const EmissionsCalculationTable: React.FC<EmissionsCalculationTableProps> = ({
  scope,
  calculations,
  onRemoveCalculation,
  scopeLabel
}) => {
  if (calculations.length === 0) {
    return null;
  }

  // Formatta la data in modo leggibile
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcola il totale delle emissioni
  const totalEmissions = calculations.reduce((sum, calc) => sum + calc.emissions, 0);

  // Funzione per gestire la rimozione
  const handleRemove = (id: string) => {
    console.log(`Removing calculation with ID: ${id}`);
    onRemoveCalculation(id);
  };

  return (
    <div className="mt-4">
      <h3 className="text-md font-medium mb-2">{scopeLabel}</h3>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableCaption>
            Totale emissioni {scopeLabel}: {totalEmissions.toFixed(2)} t CO₂e
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Fonte</TableHead>
              <TableHead>Quantità</TableHead>
              <TableHead className="text-right">Emissioni (t CO₂e)</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calculations.map((calc) => (
              <TableRow key={calc.id}>
                <TableCell className="text-xs">{formatDate(calc.date)}</TableCell>
                <TableCell>
                  <div className="text-sm">{calc.description}</div>
                </TableCell>
                <TableCell>{calc.quantity} {calc.unit}</TableCell>
                <TableCell className="text-right font-medium">{calc.emissions.toFixed(2)}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemove(calc.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmissionsCalculationTable;
