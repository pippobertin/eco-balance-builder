
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash, AlertTriangle, Loader2 } from 'lucide-react';
import { Company } from '@/context/types/companyTypes';
import { useToast } from '@/hooks/use-toast';

interface DeleteCompanyDialogProps {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (companyId: string) => Promise<boolean>;
}

const DeleteCompanyDialog: React.FC<DeleteCompanyDialogProps> = ({
  company,
  open,
  onOpenChange,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!company) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const success = await onDelete(company.id);
      
      if (success) {
        // Redirect to companies page after successful deletion
        navigate('/companies');
        toast({
          title: 'Azienda eliminata',
          description: 'L\'azienda è stata eliminata con successo.',
        });
      }
    } catch (error) {
      console.error('Error during company deletion:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante l\'eliminazione dell\'azienda.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle>Eliminare questa azienda?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Questa azione è irreversibile. Eliminando l'azienda <strong>{company.name}</strong>, verranno 
            eliminati anche tutti i report associati e tutti i dati correlati.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminazione in corso...
              </>
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" />
                Elimina azienda
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCompanyDialog;
