
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const EmissionTableHeader: React.FC = () => {
  return (
    <TableHeader className="bg-gray-50">
      <TableRow>
        <TableHead className="w-1/4">Categoria</TableHead>
        <TableHead className="w-1/6">Data</TableHead>
        <TableHead className="w-1/6">Periodo</TableHead>
        <TableHead className="w-1/6">Quantità</TableHead>
        <TableHead className="w-1/6 text-right">Emissioni (tCO₂e)</TableHead>
        <TableHead className="w-1/12"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default EmissionTableHeader;
