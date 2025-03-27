
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from 'lucide-react';

interface DeleteCompanyDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  companyName: string;
}

const DeleteCompanyDialog: React.FC<DeleteCompanyDialogProps> = ({
  open,
  onClose,
  onDelete,
  companyName
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <AlertDialogTitle>Eliminare l'azienda?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Stai per eliminare l'azienda <strong>{companyName}</strong> e tutti i dati associati. Questa azione non può essere annullata.
            <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
              <strong>Attenzione:</strong> Verranno eliminati anche tutti i report, le sedi e le aziende del gruppo associate a questa azienda.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
          >
            Elimina
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCompanyDialog;
