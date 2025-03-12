
import React from 'react';
import { X } from 'lucide-react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MaterialityIssue } from '../../types';

interface IRODialogHeaderProps {
  issue: MaterialityIssue;
  onClose: () => void;
}

const IRODialogHeader: React.FC<IRODialogHeaderProps> = ({ issue, onClose }) => {
  return (
    <DialogHeader className="border-b pb-4">
      <div className="flex items-center justify-between">
        <DialogTitle className="text-xl">IRO e Azioni: {issue.name}</DialogTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-500 mt-2">{issue.description}</p>
    </DialogHeader>
  );
};

export default IRODialogHeader;
