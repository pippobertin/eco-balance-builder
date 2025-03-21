
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useReport } from '@/hooks/use-report-context';

interface WasteEntryRowProps {
  id: string;
  description: string;
  totalWaste: number | null;
  recycledWaste: number | null;
  disposalWaste: number | null;
  onEdit: () => void;
  onDeleted: () => void;
  isHazardous?: boolean;
}

const WasteEntryRow: React.FC<WasteEntryRowProps> = ({
  id,
  description,
  totalWaste,
  recycledWaste,
  disposalWaste,
  onEdit,
  onDeleted,
  isHazardous = false
}) => {
  const { toast } = useToast();
  const { setNeedsSaving } = useReport();
  
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('waste_management')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Successo",
        description: "Rifiuto eliminato con successo"
      });
      
      setNeedsSaving(true);
      onDeleted();
    } catch (error: any) {
      console.error("Error deleting waste entry:", error);
      toast({
        title: "Errore",
        description: `Errore: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  return (
    <tr className={`hover:bg-gray-50 ${isHazardous ? 'bg-red-50' : ''}`}>
      <td className="p-2">
        <span className={`font-medium text-sm ${isHazardous ? 'text-red-700' : ''}`}>{description}</span>
      </td>
      <td className="p-2 text-right">{totalWaste !== null ? totalWaste : '-'}</td>
      <td className="p-2 text-right">{recycledWaste !== null ? recycledWaste : '-'}</td>
      <td className="p-2 text-right">{disposalWaste !== null ? disposalWaste : '-'}</td>
      <td className="p-2 text-center">
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione non può essere annullata. Il rifiuto verrà eliminato permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                  Elimina
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
};

export default WasteEntryRow;
