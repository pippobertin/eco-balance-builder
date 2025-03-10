
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Report } from '@/context/types';

interface DeleteReportDialogProps {
  reportToDelete: Report | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onDelete: () => Promise<void>;
}

const DeleteReportDialog = ({ reportToDelete, isOpen, setIsOpen, onDelete }: DeleteReportDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Conferma eliminazione
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-2">Sei sicuro di voler eliminare questo report?</p>
          {reportToDelete && (
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              <div><span className="font-medium">Anno:</span> {reportToDelete.report_year}</div>
              <div><span className="font-medium">Tipo:</span> Opzione {reportToDelete.report_type}</div>
              <div><span className="font-medium">Rendicontazione:</span> {reportToDelete.is_consolidated ? "Consolidata" : "Individuale"}</div>
            </div>
          )}
          <p className="mt-4 text-red-600 text-sm">Questa azione non può essere annullata. Tutti i dati associati a questo report saranno eliminati definitivamente.</p>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annulla
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDelete}
          >
            Elimina Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteReportDialog;
